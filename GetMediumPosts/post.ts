class Post {
    constructor(title: string, imageUrl: string, subtitle: string, blogUrl: string, publishedAt: Date) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.subtitle = subtitle;
        this.blogUrl = blogUrl;
        this.publishedAt = publishedAt;
    }
    title: string;
    imageUrl: string;
    subtitle: string;
    blogUrl: string;
    publishedAt: Date;
}