# Prisma test task

## Getting started

You need `npm` and `docker` installed on your machine. For better experience, you can install `wrangler` globally, as well as `supabase` client.

The tech stack used:
- HonoJS with TypeScript as a core API framework
- Cloudflare workers as a deployment environment
- Supabase (Postgres) as a database
- Jest and Nock for testing 
- Zod for input validation
- Github for version control and basic CI

### Launch locally
To run the project locally, follow these steps:

1. Spin off the local database instance by executing: `npm run db:start` . This should start a local Postgres instance, usually on port 54322, and apply the latest schema. As a result, you should see the local credentials in the terminal.
2. Take `API URL` and `anon key` values and paste them into `wrangler.toml` line [4] (vars) where `DB_URL` corresponds to `API URL` and `DB_KEY` to `anon_key`. 
3. Paste the API url into `src/mocks.ts` as `DB_URL`. It helps Nock to identify outgoing request. Don't worry about DB_KEY there.
4. Start the project by executing: `npm i` first, then `npm run dev`.

### How to use

There are three endpoints available that fulfill each of the functional requirements.

#### [POST] /blogs

Creates a new blog with a given name and slug. Optionally, you can provide an array of posts that will be associated with the blog.

Required:
- name: string - the name of the blog
- slug: string - the slug of the blog

Optional:
- posts: array - an array of post objects
  - title: string - (optional) the title of the post
  - content: string - (required) the content of the post

#### [GET] /blogs/:uid

Retrieves a blog with a given unique ID. Unique ID can be:
- id: number - the ID of the blog
- slug: string - the slug of the blog

Optionally, you can provide a query parameter `withPosts` to include all posts associated with the blog.

Example URL: `/blogs/1?withPosts=true` or `/blogs/dev-blog`

#### [POST] /posts

Creates a new post with a given content and associates it to the specific blog. Optionally, you can provide a post title.

Required:
- content: string - the content of the post
- blogId: number - the ID of the blog to associate the post with

Optional:
- title: string - the title of the post


_(Swagger documentation in progress)_

### Postman

You can test the microservice locally or in "production" by using the Postman collection provided in `./prisma-test-task.postman_collection.json` file. 

## Questions & answers

#### What were some of the reasons you chose the technology stack that you did?
The main reasons were:
1. **Simplicity.** I wanted to create a simple, yet powerful API that can be easily deployed and maintained with easiness to extend without the need of rewriting. Tackling: "making sure everything will also work at high scale", "implementation should be simple", "leave room for the microserve to scale". 
2. **Serverless deployments.** Supports the "delivery-first" approach which I prefer giving me control over integration with remote environment easily while decoupling myself from one single technology. The project can be deployed to plenty of infrastructure providers without major changes.
3. **TypeScript.** I wanted to ensure type safety and better code quality. It also helps with the development process and makes the code more readable.
4. **Supabase.** I wanted to use a modern, open-source database that is easy to use and provides a lot of features out of the box. The most important to me was the ability to synchronise the data and schema across the DB environments with reduced risk. It also has a great community and is well-documented. Postgres is a powerful database that can be easily scaled and is a great choice for this kind of project.

#### What were some of the trade-offs you made when building this application?

1. Cloudflare Workers don't support UDP or TCP connection type. It is necessary to use the tunnel to make it work if required. https://developers.cloudflare.com/workers/databases/connecting-to-databases/ .
2. `createClient` method proved to be a bit difficult to mock.
3. In case of the DB technology change, might be necessary to use the solution that provides HTTP API if simplicity is the key.
4. Data schemas are stored in Supabase, but we've got the ability to generate the Typescript equivalent with the most up-to-date schema and migrate it over. For the visibility sake, might be better to be able to keep the control over the schemas internally. 

#### Why were these acceptable trade-offs?

- The project is a simple microservice.
- Supabase provides a commercial and enterprise level support and scalability.
- It was said in the Bonus section that the database choice is likely temporary, considering small schema, the migration should be easy.
- Tech stack is reasonably popular and the code is clear to read and understand.

Given the easy maintainability and scalability, the trade-offs are acceptable in my opinion. 

#### Given more time, what improvements or optimizations would you want to add? When would you add them?

- Swagger documentation: as soon as possible
- Continuous delivery: as soon as possible to at least one environment
- Authentication if there is such a requirement
- Review the data caching mechanisms and perform further performance tests on large data sets.
- Improve error messages and unify their format

#### What would you need to do to make this application scale to hundreds of thousands of users?

- Optimise caching
- Possibly, optimise indexes in the DB.
- Introduce more robust CI/CD
- Introduce monitoring and alerting
- Improve error messages

#### How would you change the architecture to allow for models that are stored in different databases? E.g. posts are stored in Cassandra and blogs are stored in Postgres.

From this app perspective it's important to be able to have the TypeScript equivalent of the models. Storing models externally it's ok as long as it's possible to have a way to generate those types, either dynamically or as a common repository or automated process. 

#### How would you deploy the Architecture you designed in a production ready way?

The solution is deployed to "production".
The URL is: https://prisma-test-production.wozdev.workers.dev/

Currently, it can be achieved by:
1. Setting up the Cloudflare account.
2. Logging to it by executing `npx wrangler login`.
3. Executing: `npm run deploy`.

The go-to way would be to add another workflow into Github Actions (or other CD solution) with the deployment script with access token instead of user login. Adding a versioning mechanism would be a good idea as well.