export interface DTOProject {
  id?: number;
  projectName: string;
  projectType: string;
  projectColor: string;
  accessUserName? : any;
  background: string;
  accessUserID: any | {};
}

export interface DTOProjectInsert {
  projectName: string;
  projectType: string;
  projectColor: string;
  background: string;
  accessUserID: number;
}

export interface DTOColumns {
  id: number;
  name: string;
  color: string;
  cardStatus: string;
}

export interface DTOColumnInsert {
  name: string;
  color: string;
  cardStatus: string;
}
