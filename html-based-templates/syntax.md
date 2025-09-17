```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Template syntax</title>
  </head>

  <body>
    <h1>Template syntax</h1>
    
    <template when="user.name">
      <p>The condition is true!</p>
      
      <fallback>
        <p>The condition was false.</p>
      </fallback>
    </template>
    
    <template each="user" as="name, email">
      <p>User: {$name} | Email: {$email}</p>
      
      <fallback>
        <p>No users found.</p>
      </fallback>
    </template>
  </body>
</html>
```