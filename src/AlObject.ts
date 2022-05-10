import { StringUtils } from 'turbocommons-ts';
import * as fs from 'fs';
import { env } from 'process';
import AlField = require("./AlField");
import * as vscode from 'vscode';
class AlObject {
	private _id: string;
	public get id(): string {
		return this._id;
	}
    private _type: string;
	public get type(): string {
		return this._type;
	}
	private _name: string;
	public get name(): string {
		return this._name;
	}
	private _camelizeName: string;
	public get camelizeName(): string {
		return this._camelizeName;
	}
	private dependencyType:string;
	private dependencyFrom: string;
	private line: string;
	private remainingLine:string;
	private path:string;
	private _fieldList: AlField[];
	public get fieldList(): AlField[] {
		return this._fieldList;
	}
    constructor(path:string) {
		//get file content
		this.path = path;
		this.line = this.getFirstLine();
		this.remainingLine = this.line;
		//get type 
	 	this._type = this.getNextTag();
	 	//get id
		this._id = this.getNextTag();
		//get name
		this._name = this.getNextTag();
		this._camelizeName = AlObject.camelize(this._name);
		//check for dependency
		this.dependencyType = this.getNextTag();
		this.dependencyFrom = this.getNextTag();
		if (this.type === 'table') {
			this._fieldList = this.LoadFields();
		}else{
			this._fieldList = [];
		}
	}
	private getNextTag():string{
		let offset: number = 1;
		if (this.remainingLine.length === 0){
			return '';
		}
		let tag = this.remainingLine.match(/(?<=(^["']\b))(?:(?=(\\?))\2.)*?(?=\1)/);
		offset = 3;
		if (null === tag){
			tag = this.remainingLine.match(/[^\s]+/);
			offset = 1;
		} 
		if (null === tag){
			return '';
		}
		if (this.remainingLine.length > tag.length+offset){
		this.remainingLine = this.remainingLine.substr(tag[0].toString().length+offset);
		} else {
			this.remainingLine = '';
		}
		return tag[0].toString();
	}
	private getFirstLine():string{
		if (null === this.path){
			throw Error( 'path is null or empty');
		}
		let fileContent = fs.readFileSync(this.path,'utf8');
		let lines = fileContent.match(/^.*$/m);
	 	if ( null === lines ) {
        	throw Error( 'firstLine.parentNode is null');
		}
	 	return lines[0];
	}
	public getMdDescriptionTab():string{
		return '|'+this.type+'|'+this.id+'|'+this.name+'|\n';
	}

	private LoadFields():AlField[]{
		let list:AlField[]=[];
		let fileContent = fs.readFileSync(this.path,'utf8');
		fileContent.match(/^.*field\('*;*;*.*\)$/gm)?.forEach((element)=>{
			list.push(new AlField(element));
			
		});
		Promise.all;
		return list;
		}

	private GenerateAPIHeader():string{
		return `page xxxxxx "Api${this._name}"
{
	PageType = API;
	APIPublisher = 'cosmo';
	APIGroup = 'pbi';
	APIVersion = 'v1.0';
	EntityName = '${this._camelizeName}';
	EntitySetName = '${this._camelizeName}s';
	SourceTable = "${this._name}";
	Editable = false;
    DelayedInsert = true;
    DataAccessIntent = ReadOnly;
    ODataKeyFields = systemID;
	layout
	{
		area(Content)
		{
			group(GroupName)
			{
`;
		}
	private GenerateAPIFooter():string{
		return `				field(systemCreatedAt; Rec.SystemCreatedAt) { }
				field(systemCreatedBy; Rec.SystemCreatedBy) { }
				field(systemModifiedAt; Rec.SystemModifiedAt) { }
				field(systemModifiedBy; Rec.SystemModifiedBy) { }
				field(systemId; Rec.SystemId) { }
			}
		}
	}
}`;
	}
	public static WriteApiFile(obj:AlObject){
			var ApiText :string;
			ApiText = obj.GenerateAPIHeader();
			obj.fieldList.forEach((element)=>{
				ApiText = ApiText.concat(element.getAPIDefinition());
				
			});
			ApiText = ApiText.concat(obj.GenerateAPIFooter());
			vscode.env.clipboard.writeText(ApiText);
	}
	public static camelize(str:string) {
        return StringUtils.formatCase(str, StringUtils.FORMAT_LOWER_CAMEL_CASE);
    }
}
export = AlObject;
