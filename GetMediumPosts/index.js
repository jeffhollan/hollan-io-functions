const https = require('https');

const options = {
    hostname: "medium.com",
    port: 443,
    method: "GET",
    headers: {
        Accept: "application/json"
    },
    path: "/@jeffhollan/latest"
}


module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const mediumReq = https.request(options, (res) => {
        res.setEncoding("utf8");
        let body = "";
        res.on('data', (d) => {
            body += d;
        });
        res.on('end', () => {
            try {
                // strip off the JSON hijacking thing from Medium
                var data = JSON.parse(body.substring(body.indexOf('>') + 1));
                context.res = {
                    statusCode: 200,
                    body: ParseMedium(data)
                }
                context.done();
            }
            catch (e) {
                context.log('Invalid JSON!');
            }
        });
    });

    mediumReq.on('error', (e) => {
        context.res = {
            status: 400,
            body: e
        };
        context.done();
    });

    mediumReq.end(); 
}

function ParseMedium(data) {
    var response = {
        posts: []
    };

    for(var postId in data.payload.references.Post) {
        response.posts.push({
            title: data.payload.references.Post[postId].title,
            imageUrl: "https://cdn-images-1.medium.com/max/1000/" + data.payload.references.Post[postId].virtuals.previewImage.imageId,
            subtitle: data.payload.references.Post[postId].content.subtitle,
            blogUrl: "https://medium.com/@jeffhollan/" + data.payload.references.Post[postId].uniqueSlug
        })

        if(response.posts.length >= 4) {
            break;
        }
    }
    return response;
}
