import { GraphQLClient } from 'graphql-request';

export const graphqlClient = new GraphQLClient('https://api.studio.thegraph.com/query/74196/tapir-money/version/latest');

export const GET_ASSET_CATEGORIES = `
  query GetAssetCategories {
    assetCategories {
      id
      name
      description
      underlayingAssets
    }
  }
`;
