import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import axios from "axios"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('Get blog posts triggered.');
    
    let posts : Array<Post> = [];

    posts.concat(await returnDevToPosts());
    posts.concat(await returnMediumPosts(posts));
    
    posts.sort((a, b) => a.publishedAt < b.publishedAt ? -1 : a.publishedAt > b.publishedAt ? 1 : 0);
    
    
    context.res = {
        statusCode: 200,
        body: posts.slice(0, 4)
    };
};

const returnMediumPosts = async function(existingPosts: Array<Post>) : Promise<Array<Post>> {
    let posts : Array<Post> = [];
    let res = await axios.get('https://medium.com/@jeffhollan/latest');
    let body = JSON.parse(res.data.substring(res.data.indexOf('>') + 1));
    for (let p of body['payload']['references']['Post']) {
        // If there isn't already a Dev.To post with this title
        if(existingPosts.filter((e) => e.title == p['title']).length == 0) {
            posts.push(new Post(
                p['title'],
                'https://cdn-images-1.medium.com/max/1000/' + p['virtuals']['previewImage']['imageId'],
                p['content']['subtitle'],
                'https://medium.com/@jeffhollan/' + p['uniqueSlug'],
                new Date()
            ));
        }
    }
    return posts;
}

const returnDevToPosts = async function() : Promise<Array<Post>> {
    let posts : Array<Post> = [];
    let res = await axios.get('https://dev.to/api/articles?username=alfredosalzillo');
    let body = res.data;
    for (let p of body) {
        posts.push(new Post(
            p['title'],
            p['cover_image'],
            p['description'],
            p['url'],
            p['published_timestamp']
        ));
    }
    return posts;
}

export default httpTrigger;
