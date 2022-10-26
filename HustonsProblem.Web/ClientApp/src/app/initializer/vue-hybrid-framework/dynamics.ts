let loadedRefs: Array<Reference> = [];
const resolversOne: ResolversOne = {};
const resolversMany: ResolversMany = {};

registerResolverOne("default", (context: ResolverContext, target: any) => {
	console.log("registerResolverOne triggered");

	return new Promise((resolve, reject) => {
		target.impl = target.impl || "default";
		var ref = context.loadedRefs.find(
			(i) => i.id === target.id && i.type === target.type && i.impl == target.impl,
		);
		if (!ref) {
			reject(
				`[dynamics] No reference found for (type:${target.type}, id:${target.id}, impl:${target.impl})`,
			);
			return;
		}

		resolve(ref);
	});
});

registerResolverMany("default", (context: ResolverContext, target: any) => {
	console.log("registerResolverMany triggered");

	return new Promise((resolve, reject) => {
		target.impl = target.impl || "any";
		var refs = context.loadedRefs.filter(
			(i) =>
				i.type === target.type &&
				(i.impl == target.impl || target.impl === "any"),
		);
		if (refs.length === 0)
			reject(
				`[dynamics] No references found for (type:${target.type}, impl:${target.impl})`,
			);

		resolve(refs);
	});
});

export async function registerResolverOne(key: string, resolveFn: ResolveOneFunction) {
	resolversOne[key] = resolveFn;
}

export async function registerResolverMany(key: string, resolveFn: ResolveManyFunction) {
	resolversMany[key] = resolveFn;
}

export async function resolveOne(target: any, resolver = "default"): Promise<Reference> {
	console.log("resolveOne triggered");

	const _resolver = resolversOne[resolver];

	if (!_resolver) throw new Error(`[dynamics] Resolver '${resolver}' not found`);

	var context: ResolverContext = {
		loadedRefs: loadedRefs,
	};

	var ref = await _resolver(context, target);
	return ref;
}

export async function resolveMany(
	target: any,
	resolver = "default",
): Promise<Array<Reference>> {
	console.log("resolveMany triggered");

	const _resolver = resolversMany[resolver];

	if (!_resolver) throw new Error(`[dynamics] Resolver '${resolver}' not found`);

	var context: ResolverContext = {
		loadedRefs: loadedRefs,
	};

	var ref = await _resolver(context, target);
	return ref;
}

export async function importPackageWithMultipleEntries(
	pkg: EntryPackage,
	target = "default",
): Promise<void> {
	console.log("importPackageWithMultipleEntries triggered");

	const context: ImportContext = {
		loadedRefs: new Array<Reference>(),
	};

	if (!pkg.entries) {
		throw new Error("[dynamics] 'entries' node is missing");
	}

	var mainEntry = pkg.entries.find((x) => x.id === target);

	if (!mainEntry) throw new Error(`[dynamics] Entry '${target}' not found`);

	if (mainEntry.dependsOn) {
		var dependencies = pkg.entries.filter((i) =>
			mainEntry?.dependsOn?.some((d) => d === i.id),
		);

		for (let index = 0; index < dependencies.length; index++) {
			const dependencyPackage: Package = (await dependencies[index].import())
				.default;
			loadPackage(context, dependencyPackage);
		}
	}

	const mainPackage: Package = (await mainEntry.import()).default;
	await loadPackage(context, mainPackage);

	// TODO: Merge logic ?
	loadedRefs = [...loadedRefs, ...context.loadedRefs];
}

export async function importPackage(mainPackage: Package): Promise<void> {
	console.log("importPackage triggered");

	const context: ImportContext = {
		loadedRefs: new Array<Reference>(),
	};

	await loadPackage(context, mainPackage);

	// TODO: Merge logic ?
	loadedRefs = [...loadedRefs, ...context.loadedRefs];
}

async function loadPackage(context: ImportContext, pkg: Package): Promise<void> {
	console.log("loadPackage triggered");

	// Load any "include" packages

	if (pkg.include) {
		for (let index = 0; index < pkg.include.length; index++) {
			const includePackage = (await pkg.include[index].import()).default;
			loadPackage(context, includePackage);
		}
	}

	// Load any "ref"

	if (pkg.refs) {
		for (let index = 0; index < pkg.refs.length; index++) {
			const ref = pkg.refs[index];
			loadRef(context, ref);
		}
	}
}

function loadRef(context: ImportContext, ref: Reference) {
	console.log("loadRef triggered");

	ref.impl = ref.impl || "default";

	var i = context.loadedRefs.findIndex(
		(x) => x.id == ref.id && x.impl == ref.impl && x.type == ref.type,
	);

	// Register or "override" already registered ref
	if (i >= 0) context.loadedRefs[i] = ref;
	else context.loadedRefs.push(ref);
}

// ==================================================================================================
// ===================================== Definitions ================================================
// ==================================================================================================

export interface EntryPackage {
	entries: Array<EntryPackageReference>;
}

export interface Package {
	include?: Array<PackageReference>;
	refs?: Array<Reference>;
}

interface ImportFunction {
	(): Promise<any>;
}

interface PackageReference {
	import: ImportFunction;
}

interface EntryPackageReference {
	import: ImportFunction;
	id: string;
	dependsOn?: Array<string>;
}

export interface Reference {
	id: string;
	impl: string;
	type: string;
	import: ImportFunction;
	extends: string;
}

interface ImportContext {
	loadedRefs: Array<Reference>;
}

interface ResolveOneFunction {
	(context: ResolverContext, target: any): Promise<Reference>;
}

interface ResolveManyFunction {
	(context: ResolverContext, target: any): Promise<Array<Reference>>;
}

interface ResolversOne {
	[key: string]: ResolveOneFunction;
}

interface ResolversMany {
	[key: string]: ResolveManyFunction;
}

interface ResolverContext {
	loadedRefs: Array<Reference>;
}
