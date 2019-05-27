import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('GetStats JavaScript HttpTrigger fired.');

    context.res = {
        status: 200,
        body: {
            saved: "524.16"
        }
    }
};

export default httpTrigger;
