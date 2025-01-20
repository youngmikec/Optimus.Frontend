import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSelectChange } from '@angular/material/select';
import { filter, map, startWith } from 'rxjs/operators';
import { Location } from '@angular/common';
import {
  IMigrationRouteGroup,
  IFamilyMemberGroup,
  CountryConfigurationList,
  MigrationRouteDocumentConfigurations,
  FamilyMemberDocumentConfigurations,
  IDocumentConfiguration,
  QuestionResponseDocumentRequest,
} from 'src/app/@core/models/document-configuration.model';
import * as fromApp from 'src/app/@core/stores/app.reducer';
import * as DocumentConfigurationsActions from 'src/app/@core/stores/documentConfiguration/documentConfiguration.actions';
import * as DocumentConfigurationsSelectors from 'src/app/@core/stores/documentConfiguration/documentConfiguration.selectors';
import * as CountriesActions from 'src/app/@core/stores/countries/countries.actions';
import * as CountriesSelector from 'src/app/@core/stores/countries/countries.selectors';
import { FamilyMembersService } from 'src/app/@core/stores/familyMembers/family-members.service';
import { MigrationRouteService } from 'src/app/@core/stores/migrationRoutes/migration-routes.service';

type ActionState = 'add' | 'update';

@Component({
  selector: 'app-document-questions',
  templateUrl: './document-questions.component.html',
  styleUrls: ['./document-questions.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DocumentQuestionsComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  public actionState: ActionState = 'add';

  public documentConfigurationForm!: FormGroup;
  public selectedDocumentConfigurationIndex!: number;

  public isLoading$: Observable<boolean> = this.store.select(
    DocumentConfigurationsSelectors.getDocumentConfigurationsIsLoading
  );

  public documentConfigurations$: Observable<any[]> = this.store
    .select(DocumentConfigurationsSelectors.getAllActiveDocumentConfigurations)
    .pipe(
      filter((resp) => !!resp),
      map((resp: any) =>
        [...resp.pageItems].sort(
          (a: any, b: any) =>
            new Date(b.createdDate).getTime() -
            new Date(a.createdDate).getTime()
        )
      )
    );

  // For form initialization
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  public countries$: Observable<any> = this.store.select(
    CountriesSelector.getActiveCountries
  );
  public allCountries: string[] = [];
  public countries: string[] = [];
  public filteredCountries!: Observable<any[]> | undefined;

  public migrationRouteGroups: IMigrationRouteGroup[] = [];
  public familyMembersGroups: IFamilyMemberGroup[] = [];

  // For Payload
  public migrationRouteConfig: MigrationRouteDocumentConfigurations[] = [];
  public familyMembersConfig: FamilyMemberDocumentConfigurations[] = [];

  public countryConfigList: CountryConfigurationList[] = [];
  public migrationConfigList: MigrationRouteDocumentConfigurations[] = [];

  public yesDocumentNamesList: { name: string }[] = [];
  public yesAlternativeDocumentList: { name: string }[] = [];

  public noDocumentNamesList: { name: string }[] = [];
  public noAlternativeDocumentList: { name: string }[] = [];

  @ViewChild('countryInput') countryInput!: ElementRef<HTMLInputElement>;

  public documentConfigurationId!: number;
  public selectedMigrationRoutes: any[] = [];
  public selectedFamilyMembers: any[] = [];

  constructor(
    private _formBuilder: FormBuilder,
    private _location: Location,
    private store: Store<fromApp.AppState>,
    private migrationRouteService: MigrationRouteService,
    private familyMembersService: FamilyMembersService
  ) {}

  ngOnInit() {
    this.initializeQuestionForm();
    this.getAllActiveDocumentConfigurations();

    this.store.dispatch(CountriesActions.GetActiveCountries());
    this.setCountriesList();
    this.filterCountries();
  }

  goBack() {
    this._location.back();
  }

  resetQuestionsForm() {
    this.actionState = 'add';
    this.documentConfigurationForm.reset();

    this.selectedMigrationRoutes = [];
    this.selectedFamilyMembers = [];
    this.countries = [];

    this.yesDocumentNamesList = [];
    this.yesAlternativeDocumentList = [];
    this.noDocumentNamesList = [];
    this.noAlternativeDocumentList = [];

    this.migrationRouteGroups = [];
    this.familyMembersGroups = [];
    this.migrationRouteConfig = [];
    this.familyMembersConfig = [];
    this.countryConfigList = [];
    this.migrationConfigList = [];
  }

  getAllActiveDocumentConfigurations() {
    this.store.dispatch(DocumentConfigurationsActions.IsLoading());
    this.store.dispatch(
      DocumentConfigurationsActions.GetAllActiveDocumentConfigurations({
        payload: {
          skip: 0,
          take: 0,
        },
      })
    );
  }

  initializeQuestionForm() {
    this.documentConfigurationForm = this._formBuilder.group({
      configurationQuestion: [''],
      countriesFormControl: [''],
      countries: [[]],
      yesDocumentActivity: [''],
      noDocumentActivity: [''],
    });
  }

  setCountriesList() {
    this.countries$.pipe(filter((countries) => !!countries)).subscribe({
      next: (countries: any) =>
        (this.allCountries = countries.map((country: any) => country.name)),
    });
  }

  removeCountry(country: any): void {
    const index = this.countries.indexOf(country);
    index >= 0 && this.countries.splice(index, 1);

    const { countries } = this.documentConfigurationForm.value;
    const countriesList = countries;
    countriesList.splice(index, 1);

    this.migrationRouteGroups.splice(index, 1);
    this.familyMembersGroups.splice(index, 1);
  }

  filterCountries() {
    this.filteredCountries = this.documentConfigurationForm
      .get('countriesFormControl')
      ?.valueChanges.pipe(
        startWith(null),
        map((country: any | null) =>
          country ? this._filter(country) : this.allCountries.slice()
        )
      );
  }

  private _filter(value: any): string[] {
    return this.allCountries.filter((country) =>
      country.toLowerCase().includes(value.toLowerCase())
    );
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.countries.push(event.option.value);
    this.countryInput.nativeElement.value = '';
    this.documentConfigurationForm.get('countriesFormControl')?.setValue(null);
    let country = null;

    this.subscriptions.add(
      this.countries$.subscribe({
        next: (countries: any) => {
          country = countries.find(
            (country: any) => country.name === event.option.value
          );
        },
      })
    );

    const { countries } = this.documentConfigurationForm.value;
    this.documentConfigurationForm
      .get('countries')
      ?.patchValue([...countries, country]);
    this.getSetMigrationRoutesByCountry(country);
    this.getSetFamilyMembersByCountry(country);
  }

  getSetMigrationRoutesByCountry(country: any, isUpdate?: boolean) {
    const { id, name, migrationRouteDocumentConfigurations } = country;

    this.migrationRouteService
      .getActiveMigrationRouteByCountryId(id)
      .subscribe({
        next: (resp: any) => {
          const { succeeded, entity } = resp;

          if (!succeeded) return;
          const existingGroupIndex = this.migrationRouteGroups.findIndex(
            (group) => group.country === name
          );

          if (existingGroupIndex !== -1)
            this.migrationRouteGroups[existingGroupIndex].routes = entity.map(
              (route: any) => ({
                id: route.id,
                name: route.name,
                countryId: route.countryId,
              })
            );
          else
            this.migrationRouteGroups.push({
              country: country.name,
              countryId: country.id,
              routes: entity.map((route: any) => ({
                id: route.id,
                name: route.name,
                countryId: route.countryId,
              })),
            });

          if (isUpdate)
            this.selectedMigrationRoutes = [
              ...this.selectedMigrationRoutes,
              ...migrationRouteDocumentConfigurations.map((route: any) => ({
                id: route.migrationRouteId,
                name: route.name,
                countryId: id,
              })),
            ];
        },
      });
  }

  getSetFamilyMembersByCountry(country: any, isUpdate?: boolean) {
    const { id, name, familyMemberDocumentConfigurations } = country;

    this.familyMembersService.GetAllFamilyMembersByCountryId(id).subscribe({
      next: (resp: any) => {
        const { succeeded, entity } = resp;

        if (!succeeded) return;
        const existingMemberIndex = this.familyMembersGroups.findIndex(
          (group) => group.country === name
        );

        if (existingMemberIndex !== -1)
          this.familyMembersGroups[existingMemberIndex].members = entity.map(
            (member: any) => ({
              id: member.id,
              name: member.name,
              countryId: member.countryId,
            })
          );
        else
          this.familyMembersGroups.push({
            country: country.name,
            countryId: country.id,
            members: entity.map((member: any) => ({
              id: member.id,
              name: member.name,
              countryId: member.countryId,
            })),
          });

        if (isUpdate)
          this.selectedFamilyMembers = [
            ...this.selectedFamilyMembers,
            ...familyMemberDocumentConfigurations.map((member: any) => ({
              id: member.familyMemberId,
              name: member.name,
              countryId: id,
            })),
          ];
      },
    });
  }

  compareMigrationRoutes(
    option1: { id: number; name: string },
    option2: { id: number; name: string }
  ) {
    return option1.name === option2.name && option1.id === option2.id;
  }

  compareFamilyMembers(
    option1: { id: number; name: string },
    option2: { id: number; name: string }
  ) {
    return option1.name === option2.name && option1.id === option2.id;
  }

  migrationRouteChanged(event: MatSelectChange) {
    const routes = event.value as Array<any>;
    this.selectedMigrationRoutes = routes;
    this.migrationRouteConfig = routes.map((route) => ({
      migrationRouteId: route.id,
      name: route.name,
      isDeleted: false,
      countryId: route.countryId,
    }));
  }

  familyMembersChanged(event: MatSelectChange) {
    const members = event.value as Array<any>;
    this.selectedFamilyMembers = members;
    this.familyMembersConfig = members.map((member) => ({
      familyMemberId: member.id,
      name: member.name,
      isDeleted: false,
      countryId: member.countryId,
    }));
  }

  addDocumentName(event: MatChipInputEvent, docType: string): void {
    const value = (event.value || '').trim();
    if (!value) return;

    if (docType === 'yes-document')
      this.yesDocumentNamesList.push({ name: value });
    if (docType === 'yes-alternative-document')
      this.yesAlternativeDocumentList.push({ name: value });

    if (docType === 'no-document')
      this.noDocumentNamesList.push({ name: value });
    if (docType === 'no-alternative-document')
      this.noAlternativeDocumentList.push({ name: value });

    event.chipInput!.clear();
  }

  removeDocumentName(documentName: any, docType: string) {
    if (docType === 'yes-document') {
      const index = this.yesDocumentNamesList.indexOf(documentName);
      if (index >= 0) this.yesDocumentNamesList.splice(index, 1);
    }

    if (docType === 'yes-alternative-document') {
      const index = this.yesAlternativeDocumentList.indexOf(documentName);
      if (index >= 0) this.yesAlternativeDocumentList.splice(index, 1);
    }

    if (docType === 'no-document') {
      const index = this.noDocumentNamesList.indexOf(documentName);
      if (index >= 0) this.noDocumentNamesList.splice(index, 1);
    }

    if (docType === 'no-alternative-document') {
      const index = this.noAlternativeDocumentList.indexOf(documentName);
      if (index >= 0) this.noAlternativeDocumentList.splice(index, 1);
    }
  }

  loadSelectedDocumentConfiguration(documentConfiguration: any, index: number) {
    this.resetQuestionsForm();

    const {
      id,
      configurationQuestion,
      migrationCountryDocumentConfiguration,
      questionResponseDocuments,
    } = documentConfiguration;

    this.selectedDocumentConfigurationIndex = index;

    this.documentConfigurationId = id;
    this.actionState = 'update';

    this.documentConfigurationForm.patchValue({
      configurationQuestion,
    });

    this.countries = migrationCountryDocumentConfiguration.map(
      (country: any) => {
        const countryPreview = { ...country, id: country.countryId };
        this.getSetMigrationRoutesByCountry(countryPreview, true);
        this.getSetFamilyMembersByCountry(countryPreview, true);

        return country.name;
      }
    );

    this.documentConfigurationForm.get('countries')?.patchValue(this.countries);

    questionResponseDocuments.forEach((questionResponse: any) => {
      if (questionResponse.isYes) {
        this.yesDocumentNamesList = JSON.parse(questionResponse.name).map(
          (name: string) => ({ name })
        );

        this.yesAlternativeDocumentList = JSON.parse(
          questionResponse.alternativeDocumentName
        ).map((name: string) => ({ name }));

        this.documentConfigurationForm.patchValue({
          yesDocumentActivity: questionResponse.documentActivity,
        });
      }

      if (!questionResponse.isYes) {
        this.noDocumentNamesList = JSON.parse(questionResponse.name).map(
          (name: string) => ({ name })
        );

        this.noAlternativeDocumentList = JSON.parse(
          questionResponse.alternativeDocumentName
        ).map((name: string) => ({ name }));

        this.documentConfigurationForm.patchValue({
          noDocumentActivity: questionResponse.documentActivity,
        });
      }
    });
  }

  createUpdateDocumentConfiguration() {
    this.store.dispatch(DocumentConfigurationsActions.IsLoading());

    const {
      configurationQuestion,
      yesDocumentActivity,
      noDocumentActivity,
      countries,
    } = this.documentConfigurationForm.value;

    const yesQuestionRespDoc: QuestionResponseDocumentRequest = {
      documentNames: this.yesDocumentNamesList.map((docNames) => docNames.name),
      alternativeDocumentNames: this.yesAlternativeDocumentList.map(
        (docNames) => docNames.name
      ),
      documentActivity: yesDocumentActivity,
      isYes: true,
      isDeleted: false,
    };

    const noQuestionRespDoc: QuestionResponseDocumentRequest = {
      documentNames: this.noDocumentNamesList.map((docNames) => docNames.name),
      alternativeDocumentNames: this.noAlternativeDocumentList.map(
        (docNames) => docNames.name
      ),
      documentActivity: noDocumentActivity,
      isYes: false,
      isDeleted: false,
    };

    const countryDocumentConfigurations: CountryConfigurationList[] = [];
    countries.forEach((country: any) => {
      const { id, name } = country;

      const countryDocConfig: CountryConfigurationList = {
        countryId: id,
        name,
        migrationRouteDocumentConfigurations: this.migrationRouteConfig
          .filter((routeConfig) => routeConfig.countryId === id)
          .map((config) => {
            delete config.countryId;
            return config;
          }),
        familyMemberDocumentConfigurations: this.familyMembersConfig
          .filter((members) => members.countryId === id)
          .map((members) => {
            delete members.countryId;
            return members;
          }),
        isDeleted: false,
      };

      if (this.actionState === 'update')
        countryDocConfig['documentConfigurationId'] =
          this.documentConfigurationId;

      countryDocumentConfigurations.push(countryDocConfig);
    });

    const payload: IDocumentConfiguration = {
      configurationQuestion,
      questionResponseDocumentRequests: [yesQuestionRespDoc, noQuestionRespDoc],
      countryDocumentConfigurations,
    };

    if (this.actionState === 'update')
      payload['id'] = this.documentConfigurationId;

    if (this.actionState === 'add')
      this.store.dispatch(
        DocumentConfigurationsActions.CreateDocumentConfiguration({ payload })
      );
    else
      this.store.dispatch(
        DocumentConfigurationsActions.EditDocumentConfiguration({ payload })
      );
  }

  ngOnDestroy(): void {
    if (this.subscriptions) this.subscriptions.unsubscribe();
  }
}
