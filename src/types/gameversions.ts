export type VersionType = "mod" | "modpack";

export interface BaseGameVersion {
	id : string;
	displayName : string;
	version : string;
	gameVersion : string;
	constants : Record<string, number>;
	supported : boolean;
}

// TODO: Deprecate in favour of enum!
export interface ModpackVersion extends BaseGameVersion {}
// TODO: Deprecate in favour of enum!
export interface ModVersion extends BaseGameVersion {}

export interface GameVersions {
	modpack : ModpackVersion[];
	mod : ModVersion[];
	lastUpdated : string;
	version : string;
	schemaVersion : string;
}

export interface RouteParams {
	type : VersionType;
	id : string;
	version : string;
}
