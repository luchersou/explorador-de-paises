export interface Country {
  name: {
    common: string;
    official: string;
  };

  cca3: string;

  region: string;
  subregion?: string;

  population: number;
  area: number;

  capital?: string[];

  flags: {
    png: string;
    svg: string;
  };

  languages?: Record<string, string>;

  currencies?: Record<
    string,
    {
      name: string;
      symbol: string;
    }
  >;

  borders?: string[];
}