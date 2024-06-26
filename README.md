# Project Title

This project is a server-side application built with Express.js and MongoDB.

## Features

- User Authentication
- Testimonials
- Donors
- Volunteering Posts
- Volunteers
- Community Posts

## API Endpoints

- `POST /api/v1/testimonials`: Create a new testimonial.
- `GET /api/v1/donors`: Get all donors data.
- `GET /api/v1/volunteering-posts`: Get all volunteering posts.
- `GET /api/v1/volunteers`: Get all volunteers.
- `POST /api/v1/volunteers`: Add a new volunteer.
- `GET /api/v1/posts`: Get all community posts.
- `POST /api/v1/posts`: Add a new community post.
- `POST /api/v1/posts/:id/comments`: Add a comment to a post.

## Setup

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Start the server with `npm start`.

## Environment Variables

- `MONGODB_URI`: Your MongoDB connection string.
- `PORT`: The port on which the server will run.

## Deployment

This project is configured for deployment with Vercel. See `vercel.json` for configuration details.
