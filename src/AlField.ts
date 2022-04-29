import { StringUtils } from 'turbocommons-ts';
class AlField {
	private _id: string;
	public get id(): string {
		return this._id;
	}
    private _apiName: string;
	public get apiName(): string {
		return this._apiName;
	}
	private _name: string;
	public get name(): string {
		return this._name;
	}
	constructor(content:string) {
        this._id = this.parseId(content);
        this._name = this.parseName(content);
        this._apiName = AlField.camelize(this._name);
	}

    private parseId(content:string):string{
        let id = content.match(/[1-9][0-9]*/g);
        if (null === id){
           return ''; 
        }
        return id[0] as string;
    }

    private parseName(content:string):string{
        let name = content.match(/(?<=; ).*(?=;)/g);
        if (null === name){
           return ''; 
        }

        return name[0] as string;
    }

    public static camelize(str:string) {
        return StringUtils.formatCase(str, StringUtils.FORMAT_LOWER_CAMEL_CASE);
      }

	public getAPIDefinition():string{
        return('				field('+ this.apiName + '; Rec.'+this._name + ') { }\n');
    }


}
export = AlField;