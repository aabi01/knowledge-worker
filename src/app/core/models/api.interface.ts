export interface Api {
  id: string;
  name: string;
  description: string;
  parameters: ApiParameter[];
  availableAttributes: string[];
  endpoint?: string;
}

export interface ApiParameter {
  name: string;
  description: string;
  type: 'string' | 'number' | 'boolean';
  required: boolean;
  defaultValue?: string;
}
