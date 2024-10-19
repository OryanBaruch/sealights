export interface Address {
  name: string;
  countryId: number;
  cityId: number;
  street: string;
}

export interface Person {
  id: number;
  name: string;
  birthdate?: string;
  addresses: Address[];
}

export interface City {
  id: number;
  name: string;
  countryId: number;
}

export interface Country {
  id: number;
  name: string;
  cities: City[]
}
