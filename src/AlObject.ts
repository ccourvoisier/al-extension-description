import * as fs from 'fs';

class AlObject {
	private id: string;
    private type: string;
	private name: string;
	private dependencyType:string;
	private dependencyFrom: string;
	private line: string;
	private remainingLine:string;
	private path:string;
    constructor(path:string) {
		//get file content
		this.path = path;
		this.line = this.getFirstLine();
		this.remainingLine = this.line;
		//get type 
	 	this.type = this.getNextTag();
	 	//get id
		this.id = this.getNextTag();
		//get name
		this.name = this.getNextTag();
		//check for dependency
		this.dependencyType = this.getNextTag();
		this.dependencyFrom = this.getNextTag();
		
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
			throw Error( 'tag is null');
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
}
export = AlObject;