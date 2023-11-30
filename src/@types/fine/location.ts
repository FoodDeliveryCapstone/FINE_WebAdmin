export interface TGoongType {
    result: Result
    status: string
  }
  
  export interface Result {
    place_id: string
    formatted_address: string
    geometry: Geometry
    plus_code: PlusCode
    compound: Compound
    name: string
    url: string
    types: string[]
  }
  
  export interface Geometry {
    location: Location
  }
  
  export interface Location {
    lat: number
    lng: number
  }
  
  export interface PlusCode {
    compound_code: string
    global_code: string
  }
  
  export interface Compound {
    district: string
    commune: string
    province: string
  }
  