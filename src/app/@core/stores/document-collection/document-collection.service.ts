import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as fromApp from '../app.reducer';
import { Store } from '@ngrx/store';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DocumentCollectionService {
  private optivaImmigrationUrl = environment.OptivaImmigrationUrl;

  constructor(
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}

  getApplicationResponse(userId: string, applicationId: number) {
    return this.http.get<any>(
      `${this.optivaImmigrationUrl}/DocumentCollection/getapplicationresponsebyapplicationid`,
      {
        params: {
          userId,
          applicationId,
        },
      }
    );
  }

  getDocumentQuestionWithFamilyType(params: any) {
    return this.http.get<any>(
      `${this.optivaImmigrationUrl}/DocumentCollection/getdocumentquestionswithfamilytypesquery`,
      { params }
    );
  }

  getDocumentParameters(userId: string, applicationId: number) {
    return this.http.get<any>(
      `${this.optivaImmigrationUrl}/DocumentCollection/getdocumentparametersquery/${userId}/${applicationId}`
    );
  }

  getDocumentFolderFiles(params: any) {
    return this.http.get<any>(
      `${this.optivaImmigrationUrl}/DocumentCollection/getdocumentsbyfolderid`,
      { params }
    );
  }

  uploadFamilyMemberDocument(payload: FormData) {
    return this.http.post<any>(
      `${this.optivaImmigrationUrl}/DocumentCollection/uploadfamilymemberdocumentcommand`,
      payload
    );
  }

  replaceFamilyMemberDocument(payload: FormData) {
    return this.http.post<any>(
      `${this.optivaImmigrationUrl}/DocumentCollection/replacefamilymemberdocumentcommand`,
      payload
    );
  }

  saveApplicationFamilyMemberDetails(payload: any) {
    return this.http.post<any>(
      `${this.optivaImmigrationUrl}/DocumentCollection/saveApplicationfamilymemberdetailscommand`,
      payload
    );
  }

  saveDocumentParameters(payload: any) {
    return this.http.post<any>(
      `${this.optivaImmigrationUrl}/DocumentCollection/savedocumentparameterscommand`,
      payload
    );
  }

  submitDocumentParameters(payload: any) {
    return this.http.post<any>(
      `${this.optivaImmigrationUrl}/DocumentCollection/submitdocumentparameterscommand`,
      payload
    );
  }

  getFamilyMembers(applicationId: number) {
    return this.store.select('auth').pipe(
      switchMap(({ user }: any) => {
        // const userId = user.UserId;
        return this.http.get<any>(
          `${this.optivaImmigrationUrl}/DocumentCollection/getfamilymembers/${user.UserId}/${applicationId}`
        );
      })
    );
  }

  getFamilyMemberFolders(familyMemberId: number) {
    return this.store.select('auth').pipe(
      switchMap(({ user }: any) => {
        const userId = user.UserId;
        return this.http.get<any>(
          `${this.optivaImmigrationUrl}/DocumentCollection/getfamilymemberfoldersbyfamilyemberid`,
          {
            params: {
              userId,
              familyMemberId,
            },
          }
        );
      })
    );
  }

  completeDocumentCollation(applicationId: number, documentId: number) {
    return this.store.select('auth').pipe(
      switchMap(({ user }: any) => {
        const userId = user.UserId;
        return this.http.put<any>(
          `${this.optivaImmigrationUrl}/DocumentCollection/completedocumentcollation`,
          {
            userId,
            applicationId,
            documentId,
          }
        );
      })
    );
  }

  getDocumentComments(documentId: number) {
    return this.store.select('auth').pipe(
      switchMap(({ user }: any) => {
        const userId = user.UserId;
        return this.http.get<any>(
          `${this.optivaImmigrationUrl}/DocumentCollection/getcommentsbydocumentid/${userId}/${documentId}`
        );
      })
    );
  }

  createDocumentComments(documentId: number, comment: string) {
    return this.store.select('auth').pipe(
      switchMap(({ user }: any) => {
        const userId = user.UserId;
        return this.http.post<any>(
          `${this.optivaImmigrationUrl}/DocumentCollection/createdocumentcomment`,
          {
            userId,
            documentId,
            comment,
          }
        );
      })
    );
  }

  getDocumentVersionHistory(documentId: number) {
    return this.store.select('auth').pipe(
      switchMap(({ user }: any) => {
        const userId = user.UserId;
        return this.http.get<any>(
          `${this.optivaImmigrationUrl}/DocumentCollection/getdocumentversionhistorybydocumentid/${userId}/${documentId}`
        );
      })
    );
  }

  getDocumentOfficers(userId: string, applicationId: number) {
    return this.http.get<any>(
      `${this.optivaImmigrationUrl}/ApplicationApproval/getofficerbyapplicationid/${userId}/${applicationId}`
    );
  }
}
