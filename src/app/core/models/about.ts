export interface AboutStat {
  id:number;
  value: string;
  label: string;

}

export interface AboutData{
  _id?:string;
  sectionTag:string;
  title: string;
  description: string;
  stats:AboutStat[];
}
export type UpdateAboutPayload= Partial<AboutData>;
export type UpdateStatPayload=Partial<AboutStat>;
