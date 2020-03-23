let env: string

const hostname = window?.location?.hostname
if (hostname === "admin.commongrounds.co") {
  env = "production"
} else {
  env = "development"
}

export const environment = env

export const production = env === "production"

export const apiUrl = production
  ? "https://api.commongrounds.co/graphql"
  : "http://localhost:5555/graphql"

export const webUrl = production
  ? "https://admin.commongrounds.co"
  : "http://localhost:3000"
