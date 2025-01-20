import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
//import { CommentCategory } from '../enums/comment-type.enum';

export const regexValidator = (
  regex: RegExp,
  error: ValidationErrors
): ValidatorFn => {
  return (control: AbstractControl): { [key: string]: any } | any => {
    if (!control.value) {
      return null;
    }

    const valid = regex.test(control.value);

    return valid ? null : error;
  };
};

export const aplhabetNumber = (number: number): string => {
  return String.fromCharCode(number + 64);
};

/**
 * Returns a date string by adding or subtracting days from the current date.
 * @param {number} days - Number of days to add (positive) or subtract (negative).
 * @param {string} [format='YYYY-MM-DD'] - Desired date format.
 * @returns {string} Formatted date string.
 */
export const getDateWithOffset = (
  days: number,
  format: string = 'YYYY-MM-DD'
): string => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + days);

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');

  switch (format) {
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    case 'MM-DD-YYYY':
      return `${month}-${day}-${year}`;
    case 'DD-MM-YYYY':
      return `${day}-${month}-${year}`;
    default:
      throw new Error(
        'Unsupported date format. Use YYYY-MM-DD, MM-DD-YYYY, or DD-MM-YYYY.'
      );
  }
};

export const generateUUID = (): string => {
  return uuidv4();
};

// Helper function to add commas to a numberZ
export const addCommas = (value: string) => {
  if (!value) return '';
  // Regular expression to add commas every three digits
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const convertToNumber = (amountWithCommas: string): number => {
  // Remove commas from the string using replace() and convert it to a number
  const amountWithoutCommas = amountWithCommas.replace(/,/g, '');
  return Number(amountWithoutCommas);
};

export const formatPhoneNumber = (phoneNumber: string | undefined): string => {
  let formatted: string = '';
  if (phoneNumber) {
    // Remove any non-digit characters (like spaces, dashes, or parentheses)
    const cleaned = phoneNumber.replace(/\D/g, '');

    // Format the cleaned number in groups of 3 and 4
    formatted = cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
  }
  return formatted;
};

export const sortAndMapTableData = (
  tableData: any[],
  sortingOrder: 'asc' | 'desc',
  propertyToSortBy: string,
  allDateProperties?: any[]
) => {
  const modifiedData: any[] = [];

  tableData?.forEach((dataEl: any) => {
    let modifiedDataEl = {
      ...dataEl,
    };

    allDateProperties?.forEach((dateProp: any) => {
      modifiedDataEl = {
        ...modifiedDataEl,

        [dateProp]: new Date(dataEl[dateProp]).getTime(),

        // createdDate: new Date(dataEl.createdDate).getTime(),
        // lastModifiedDate: new Date(dataEl.lastModifiedDate).getTime(),
      };
    });

    modifiedData.push(modifiedDataEl);
  });

  const sortedData = modifiedData.slice().sort((a, b) => {
    const dateA = new Date(a[propertyToSortBy]).getTime();
    const dateB = new Date(b[propertyToSortBy]).getTime();

    let result: any;

    if (sortingOrder === 'asc') {
      result = dateA - dateB;
    } else if (sortingOrder === 'desc') {
      result = dateB - dateA;
    }

    return result;
  });

  return sortedData;
};

export const roundNumber = (value: number, precision: number = 1) => {
  const multiplier = Math.pow(10, precision || 0);

  const result = Math.round(value * multiplier) / multiplier;

  return isNaN(result) === false ? result : 0;
};

export const calculateMandatoryAndOptionalFieldsPercentage = (
  allMandatoryFields: string[],
  allOptionalFields: string[],
  allArrayFields_NotFormArray: string[],
  formValueObject: any,
  returnCount: boolean = false,
  numberOfFormArraysInAllMandatoryFields?: number,
  numberOfFormArraysInAllOptionalFields?: number,
  allMandatoryFields_FormArray?: string[],
  allOptionalFields_FormArray?: string[],
  allArrayFields_FormArray?: string[],
  numberOfDisabledMandatoryFields?: number,
  numberOfDisabledOptionalFields?: number,
  numberOfDisabledMandatoryFields_FormArray?: number,
  numberOfDisabledOptionalFields_FormArray?: number,
  formArrayCount?: number,
  numberOfUnrequiredMandatoryFields?: number,
  numberOfUnrequiredOptionalFields?: number,
  numberOfUnrequiredMandatoryFields_FormArray?: number,
  numberOfUnrequiredOptionalFields_FormArray?: number
):
  | {
      mandatoryFieldsPercentage: string;
      optionalFieldsPercentage: string;
    }
  | any => {
  let numberOfFilledMandatoryFields = 0;
  let numberOfFilledOptionalFields = 0;
  let mandatoryFieldsPercentage = 0;
  let optionalFieldsPercentage = 0;

  allMandatoryFields?.forEach((field) => {
    if (
      formValueObject[field] &&
      formValueObject[field] !== null &&
      formValueObject[field] !== ''
    ) {
      if (
        Array.isArray(formValueObject[field]) &&
        !allArrayFields_NotFormArray.includes(field)
      ) {
        let mandatoryResData!: any;
        let optionalResData!: any;

        if (formValueObject?.documents) {
          const tempDocumentObjects = formValueObject?.documents;
          const temp = Object.values(tempDocumentObjects).filter((el: any) => {
            return el?.documentTab_IsMandatory === true;
          });

          formValueObject = { documents: temp };
        }

        formValueObject[field]?.forEach((field_inArray: any) => {
          mandatoryResData = calculateMandatoryAndOptionalFieldsPercentage(
            allMandatoryFields_FormArray!,
            [],
            allArrayFields_FormArray!,
            field_inArray,
            true,
            0,
            0
          );

          optionalResData = calculateMandatoryAndOptionalFieldsPercentage(
            [],
            allOptionalFields_FormArray!,
            allArrayFields_FormArray!,
            field_inArray,
            true,
            0,
            0
          );

          numberOfFilledMandatoryFields +=
            mandatoryResData.numberOfFilledMandatoryFields;

          numberOfFilledOptionalFields +=
            optionalResData.numberOfFilledOptionalFields;
        });
      } else {
        if (Object.keys(formValueObject).includes(field)) {
          if (Array.isArray(formValueObject[field])) {
            if (formValueObject[field]?.length !== 0) {
              numberOfFilledMandatoryFields += 1;
            }
          }
          /**For Documents Tab (isMandatory) Edge Case**/
          // else if ()
          /*********************************************/
          else {
            numberOfFilledMandatoryFields += 1;
          }
        }
      }
    }
  });

  allOptionalFields?.forEach((field) => {
    if (
      formValueObject[field] &&
      formValueObject[field] !== null &&
      formValueObject[field] !== ''
    ) {
      if (
        Array.isArray(formValueObject[field]) &&
        !allArrayFields_NotFormArray.includes(field)
      ) {
        //
      } else {
        if (Object.keys(formValueObject).includes(field)) {
          if (Array.isArray(formValueObject[field])) {
            if (formValueObject[field]?.length !== 0) {
              numberOfFilledOptionalFields += 1;
            }
          } else {
            numberOfFilledOptionalFields += 1;
          }
        }
      }
    }
  });

  if (returnCount === false) {
    if (!numberOfDisabledMandatoryFields && !numberOfDisabledOptionalFields) {
      numberOfDisabledMandatoryFields = 0;
      numberOfDisabledOptionalFields = 0;
    }

    if (!numberOfUnrequiredMandatoryFields_FormArray) {
      numberOfUnrequiredMandatoryFields_FormArray = 0;
    }

    if (
      (!allMandatoryFields_FormArray ||
        allMandatoryFields_FormArray?.length === 0) &&
      !formArrayCount &&
      !numberOfFormArraysInAllMandatoryFields
    ) {
      mandatoryFieldsPercentage = roundNumber(
        (numberOfFilledMandatoryFields * 100) /
          (allMandatoryFields?.length - numberOfDisabledMandatoryFields!),
        2
      );
    } else {
      mandatoryFieldsPercentage = roundNumber(
        (numberOfFilledMandatoryFields * 100) /
          (allMandatoryFields?.length -
            numberOfFormArraysInAllMandatoryFields! -
            numberOfDisabledMandatoryFields! +
            (allMandatoryFields_FormArray!.length * formArrayCount! -
              numberOfDisabledMandatoryFields_FormArray! -
              numberOfUnrequiredMandatoryFields_FormArray)),
        2
      );
    }

    if (
      (!allOptionalFields_FormArray ||
        allOptionalFields_FormArray?.length === 0) &&
      !formArrayCount &&
      !numberOfFormArraysInAllOptionalFields
    ) {
      optionalFieldsPercentage = roundNumber(
        (numberOfFilledOptionalFields * 100) /
          (allOptionalFields?.length - numberOfDisabledOptionalFields!),
        2
      );
    } else {
      optionalFieldsPercentage = roundNumber(
        (numberOfFilledOptionalFields * 100) /
          (allOptionalFields?.length -
            numberOfFormArraysInAllOptionalFields! -
            numberOfDisabledOptionalFields! +
            (allOptionalFields_FormArray!.length * formArrayCount! -
              numberOfDisabledOptionalFields_FormArray!)),
        2
      );
    }

    return {
      mandatoryFieldsPercentage: `${mandatoryFieldsPercentage}%`,
      optionalFieldsPercentage: `${optionalFieldsPercentage}%`,
    };
  } else {
    return { numberOfFilledMandatoryFields, numberOfFilledOptionalFields };
  }
};

export const checkDeclarationAndSignatureDocumentComponentsAreValidInVendorRegistration =
  () => {
    const allAfxmItems = document.querySelectorAll(
      '#declaration-signature .afxm-item'
    );

    return Array.from(allAfxmItems).every((afxmItem) => {
      const element = JSON.parse(afxmItem.getAttribute('data-component')!);

      return element?.value !== null && element?.value !== '';
    });
  };

export const convertToFormData = (data: any) => {
  const formData: any = new FormData();

  if (data) {
    const keys = Object.keys(data);

    keys.forEach((key: string) => {
      formData.append(key, data[key]);
    });
  }

  return formData;
};

// export const selectCommentId = (categoryId: any, data: any) => {
//   let id;
//   switch (categoryId) {
//     case CommentCategory.Contract:
//       id = data?.vendorContractId;
//       break;

//     case CommentCategory.WorkRequest:
//       id = data?.workRequestId;
//       break;

//     default:
//       id = data?.vendorId;
//       break;
//   }

//   return id;
// };

export const dataURLtoFile = (dataurl: any, filename: any) => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};

export const findRegexMatches = (
  regex: RegExp,
  str: string,
  matches: any[] = []
) => {
  const res: any = regex.exec(str);
  res && matches.push(res[1]) && findRegexMatches(regex, str, matches);
  return matches;
};

export function sortArrayWithCondition(arr: any[], key: string) {
  const newArr = [...arr].sort((p1, p2) => {
    if (p1[key] === null && p2[key] === null) {
      return 0; // Preserve order for null values
    } else if (p1[key] === null) {
      return 1; // Move null values to the end
    } else if (p2[key] === null) {
      return -1; // Move null values to the end
    }

    if (p1[key] === 0 && p2[key] !== 0) {
      return 1; // Move 0s to the end
    } else if (p2[key] === 0 && p1[key] !== 0) {
      return -1; // Move 0s to the end
    }

    return p1[key] < p2[key] ? -1 : p1[key] > p2[key] ? 1 : 0;
  });

  return newArr;
}

export function imgPlaceHolder(event: any) {
  event.target.src = 'src/assets/images/logo.png';
}
