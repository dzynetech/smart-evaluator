export interface Filter {
  equalTo: string | number;
}

export interface BooleanFilterElement {
  classification: {
    isNull?: boolean;
    equalTo?: string;
  };
}

export interface FilterVars {
  order: string;
  classification: BooleanFilterElement[] | undefined;
  sourceId: Filter | undefined;
  min_sqft: number;
  min_cost: number;
  street: string;
  city: string;
  state: string;
  zip: string;
  permitData: string;
  note: string;
}

export interface QueryVars extends FilterVars {
  numPerPage: number;
  offset: number;
}
