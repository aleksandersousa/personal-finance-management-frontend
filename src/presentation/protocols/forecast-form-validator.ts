import { FormValidator, ValidationResult } from './form-validator';

export interface ForecastFormData {
  period: 3 | 6 | 12;
  includeVariableProjections: boolean;
  confidenceThreshold: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface ForecastFormValidator extends FormValidator<ForecastFormData> {
  validate(data: unknown): ValidationResult<ForecastFormData>;
}
