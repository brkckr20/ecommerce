export const PRODUCTS_QUERY = `#graphql
query Products($first: Int!, $after: String) {
  products(first: $first, after: $after) {
    pageInfo {
      hasNextPage
      endCursor
    }
    edges {
      node {
        id
        handle
        title
        tags
        descriptionHtml
        availableForSale
        totalInventory
        priceRange {
          minVariantPrice { amount currencyCode }
          maxVariantPrice { amount currencyCode }
        }
        compareAtPriceRange {
          minVariantPrice { amount currencyCode }
        }
        images(first: 10) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 100) {
          edges {
            node {
              id
              title
              sku
              availableForSale
              quantityAvailable
              price { amount currencyCode }
              compareAtPrice { amount currencyCode }
              selectedOptions { name value }
              image { url }
            }
          }
        }
        options {
          name
          values
        }
        collections(first: 10) {
          edges {
            node {
              id
              handle
              title
            }
          }
        }
        seo {
          title
          description
        }
      }
    }
  }
}`;

export const PRODUCT_BY_HANDLE_QUERY = `#graphql
query ProductByHandle($handle: String!) {
  productByHandle(handle: $handle) {
    id
    handle
    title
    tags
    descriptionHtml
    availableForSale
    totalInventory
    priceRange {
      minVariantPrice { amount currencyCode }
      maxVariantPrice { amount currencyCode }
    }
    compareAtPriceRange {
      minVariantPrice { amount currencyCode }
    }
    images(first: 10) {
      edges {
        node {
          url
          altText
        }
      }
    }
    variants(first: 100) {
      edges {
        node {
          id
          title
          sku
          availableForSale
          quantityAvailable
          price { amount currencyCode }
          compareAtPrice { amount currencyCode }
          selectedOptions { name value }
          image { url }
        }
      }
    }
    options {
      name
      values
    }
    collections(first: 10) {
      edges {
        node {
          id
          handle
          title
        }
      }
    }
    seo {
      title
      description
    }
  }
}`;

export const COLLECTIONS_QUERY = `#graphql
query Collections($first: Int!) {
  collections(first: $first) {
    edges {
      node {
        id
        handle
        title
        descriptionHtml
        image {
          url
          altText
        }
      }
    }
  }
}`;

export const MENU_QUERY = `#graphql
query Menu($handle: String!) {
  menu(handle: $handle) {
    id
    handle
    title
    items {
      id
      title
      url
      type
      items {
        id
        title
        url
        type
        items {
          id
          title
          url
          type
        }
      }
    }
  }
}`;

export const COLLECTIONS_WITH_COUNTS_QUERY = `#graphql
query CollectionsWithCounts($first: Int!) {
  collections(first: $first) {
    edges {
      node {
        id
        handle
        title
        image {
          url
          altText
        }
        products(first: 250) {
          edges {
            cursor
          }
        }
      }
    }
  }
}`;

export const CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION = `#graphql
mutation CustomerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
  customerAccessTokenCreate(input: $input) {
    customerAccessToken {
      accessToken
      expiresAt
    }
    customerUserErrors {
      code
      field
      message
    }
  }
}`;

export const CUSTOMER_CREATE_MUTATION = `#graphql
mutation CustomerCreate($input: CustomerCreateInput!) {
  customerCreate(input: $input) {
    customer {
      id
      firstName
      lastName
      email
      phone
    }
    customerUserErrors {
      code
      field
      message
    }
  }
}`;

export const CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION = `#graphql
mutation CustomerAccessTokenDelete($customerAccessToken: String!) {
  customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
    deletedAccessToken
    userErrors {
      field
      message
    }
  }
}`;

export const CUSTOMER_QUERY = `#graphql
query Customer($customerAccessToken: String!) {
  customer(customerAccessToken: $customerAccessToken) {
    id
    firstName
    lastName
    email
    phone
    numberOfOrders
    defaultAddress {
      id
      address1
      address2
      city
      province
      zip
      country
      phone
      firstName
      lastName
    }
    addresses(first: 10) {
      edges {
        node {
          id
          address1
          address2
          city
          province
          zip
          country
          phone
          firstName
          lastName
        }
      }
    }
    orders(first: 10) {
      edges {
        node {
          id
          name
          totalPrice { amount currencyCode }
          processedAt
          fulfillmentStatus
          financialStatus
          lineItems(first: 10) {
            edges {
              node {
                title
                quantity
                variant {
                  id
                  title
                  image { url }
                }
              }
            }
          }
        }
      }
    }
  }
}`;

export const CUSTOMER_UPDATE_MUTATION = `#graphql
mutation CustomerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
  customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
    customer {
      id
      firstName
      lastName
      email
      phone
    }
    customerUserErrors {
      code
      field
      message
    }
  }
}`;

export const CUSTOMER_ADDRESS_CREATE_MUTATION = `#graphql
mutation CustomerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
  customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
    customerAddress {
      id
      address1
      address2
      city
      province
      zip
      country
      phone
      firstName
      lastName
    }
    customerUserErrors {
      code
      field
      message
    }
  }
}`;

export const CUSTOMER_ADDRESS_UPDATE_MUTATION = `#graphql
mutation CustomerAddressUpdate($customerAccessToken: String!, $addressId: ID!, $address: MailingAddressInput!) {
  customerAddressUpdate(customerAccessToken: $customerAccessToken, addressId: $addressId, address: $address) {
    customerAddress {
      id
      address1
      address2
      city
      province
      zip
      country
    }
    customerUserErrors {
      code
      field
      message
    }
  }
}`;

export const CUSTOMER_ADDRESS_DELETE_MUTATION = `#graphql
mutation CustomerAddressDelete($customerAccessToken: String!, $id: ID!) {
  customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
    deletedCustomerAddressId
    userErrors {
      field
      message
    }
  }
}`;

export const COLLECTION_BY_HANDLE_QUERY = `#graphql
query CollectionByHandle($handle: String!) {
  collectionByHandle(handle: $handle) {
    id
    handle
    title
    descriptionHtml
    image {
      url
      altText
    }
    products(first: 250) {
      edges {
        node {
          id
          handle
          title
          descriptionHtml
          availableForSale
          totalInventory
          priceRange {
            minVariantPrice { amount currencyCode }
            maxVariantPrice { amount currencyCode }
          }
          compareAtPriceRange {
            minVariantPrice { amount currencyCode }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 100) {
            edges {
              node {
                id
                title
                sku
                availableForSale
                quantityAvailable
                price { amount currencyCode }
                compareAtPrice { amount currencyCode }
                selectedOptions { name value }
                image { url }
              }
            }
          }
          options {
            name
            values
          }
        }
      }
    }
  }
}`;

export const CART_DISCOUNT_CODES_UPDATE_MUTATION = `#graphql
mutation CartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]) {
  cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
    cart {
      id
      checkoutUrl
      totalQuantity
      cost {
        subtotalAmount { amount currencyCode }
        totalAmount { amount currencyCode }
      }
      discountCodes {
        code
        applicable
      }
      lines(first: 100) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                sku
                price { amount currencyCode }
                product {
                  handle
                  title
                  images(first: 1) {
                    edges { node { url } }
                  }
                }
              }
            }
          }
        }
      }
    }
    userErrors {
      field
      message
    }
  }
}`;

export const METAOBJECT_BY_HANDLE_QUERY = `#graphql
query MetaobjectByHandle($handle: MetaobjectHandleInput!) {
  metaobjectByHandle(handle: $handle) {
    id
    handle
    fields {
      key
      value
      reference {
        ... on MediaImage {
          image {
            url
          }
        }
        ... on Metaobject {
          id
        }
      }
    }
  }
}`;
