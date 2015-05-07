# lendingclub
Using the LendingClub API in NodeJS

Here's a rundown of what's currently in the repository:

`helpers.js` is a simple object which contains generic LendingClub API data.

`queryRoutes` is a Node module which exports three functions which will allow you to consume API routes:

  *the `queryAccountsRoute` function allows you query any of the 'Accounts' resources by passing the name of the route as the first argument.
  *`queryLoansRoute` allows you to query the loans resource. You'll still have to specify the route name (in case more than one is available in the future)
  *`placeOrder` sends your order data as a POST request to the API. The third argument to the function should contain your purchase information.
  
You will need to provide your own `credentials.js` file with your account number and API key.

The other files in the repository contain specific examples of how I use the API to purchase loans in an automated fashion. I've discussed these scripts in great detail in a series of blog posts available (here)[http://dandorset.me/wp/2015/04/using-the-lending-club-api-part-1/].
