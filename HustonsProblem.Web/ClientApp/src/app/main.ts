import { initApplication } from "./initializer/initializer";

initApplication({
	include: [{ import: () => import("../components/exports") }],
});
