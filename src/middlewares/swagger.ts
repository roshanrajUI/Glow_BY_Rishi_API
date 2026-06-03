import type { Application } from "express";
import swaggerUi from "swagger-ui-express";

export default class SwaggerMiddlewareConfig {
    public static setUp(expressApp: Application):void{
        expressApp.use(
            "/api-doc",
            swaggerUi.serve,
            swaggerUi.setup(undefined, {
                swaggerOptions: {
                    url: "/swagger.json",
                }
            })
        );
    }
}