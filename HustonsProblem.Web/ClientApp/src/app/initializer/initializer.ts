import { importPackage, Package } from "./vue-hybrid-framework/dynamics";
import { loadFromDOM as loadRootVueComponentsFromDOM } from "./vue-hybrid-framework/vue-components-loader";
export async function initApplication(mainPackage: Package) {
	console.debug("[App] Initializing Application...");

	console.debug("[App] Importing static JS modules...");
	await importPackage(mainPackage);
	console.debug("[App] Importing static JS modules completed!");

	console.debug("[App] Loading Vue components..");
	await loadRootVueComponentsFromDOM();
	console.debug("[App] Loading Vue components Completed!");

	console.debug("[App] Initiallization Complete!");
}
