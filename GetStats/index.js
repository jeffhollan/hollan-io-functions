module.exports = function (context, req) {
    context.log('GetStats JavaScript HttpTrigger fired.');

    context.res = {
        status: 200,
        body: {
            saved: "524.16"
        }
    }
    context.done();
};