```bash
$ bin/rails server
```

# Rails-app

Rails is a web application framework running on the Ruby programming language.

Rails is a web application development framework written in the Ruby language. It is designed to make programming web applications easier by making assumptions about what every developer needs to get started. It allows you to write less code while accomplishing more than many other languages and frameworks. Experienced Rails developers also report that it makes web application development more fun.

The Rails philosophy includes two major guiding principles:

- Don't Repeat Yourself: DRY is a principle of software development which states that "Every piece of knowledge must have a single, unambiguous, authoritative representation within a system." By not writing the same information over and over again, our code is more maintainable, more extensible, and less buggy.

- Convention Over Configuration: Rails has opinions about the best way to do many things in a web application, and defaults to this set of conventions, rather than require that you specify every minutiae through endless configuration files.

tools:
- ruby
- sqlite3
- rails

Rails comes with a number of scripts called generators that are designed to make your development life easier by creating everything that's necessary to start working on a particular task. One of these is the new application generator, which will provide you with the foundation of a fresh Rails application so that you don't have to write it yourself.

`A controller's purpose is to receive specific requests for the application. Routing decides which controller receives which requests. Often, there is more than one route to each controller, and different routes can be served by different actions. Each action's purpose is to collect information to provide it to a view.`

A view's purpose is to display this information in a human readable format. An important distinction to make is that it is the controller, not the view, where information is collected. The view should just display that information. By default, view templates are written in a language called eRuby (Embedded Ruby) which is processed by the request cycle in Rails before being sent to the user.


`Location: ./app/config/routes.rb`
```ruby
Rails.application.routes.draw do
  get 'welcome/index'
 
  root 'welcome#index'
end
```

- root 'welcome#index' tells Rails to map requests to the root of the application to the welcome controller's index action and get 'welcome/index' tells Rails to map requests to http://localhost:3000/welcome/index to the welcome controller's index action. This was created earlier when you ran the controller generator (bin/rails generate controller Welcome index).

- Launch the web server again if you stopped it to generate the controller (bin/rails
server) and navigate to http://localhost:3000 in your browser. You'll see the "Hello, Rails!" message you put into app/views/welcome/index.html.erb, indicating that this new route is indeed going to WelcomeController's index action and is rendering the view correctly.

- 对应关系： route - controller - request
This error occurs because the route needs to have a controller defined in order to serve the request. The solution to this particular problem is simple: create a controller called ArticlesController. You can do this by running this command:

```bash
$ bin/rails generate controller Articles
```


- 定义：
关键词： controller- actions - template（views）

  A controller is simply a class that is defined to inherit from ApplicationController. It's inside this class that you'll define methods that will become the actions for this controller. These actions will perform CRUD operations on the articles within our system.

This error indicates that Rails cannot find the new action inside the ArticlesController that you just generated. This is because when controllers are generated in Rails they are empty by default, unless you tell it your desired actions during the generation process.

The form needs to use a different URL in order to go somewhere else. This can be done quite simply with the :url option of form_for. Typically in Rails, the action that is used for new form submissions like this is called "create", and so the form should be pointed to that action.

```ruby
<%= form_for :article, url: articles_path do |f| %>
```

`The articles_path helper tells Rails to point the form to the URI Pattern associated with the articles prefix; and the form will (by default) send a POST request to that route. This is associated with the create action of the current controller, the ArticlesController.`

When a form is submitted, the fields of the form are sent to Rails as parameters. These parameters can then be referenced inside the controller actions, typically to perform a particular task.

- 类似于flask 的 controller class from 结构

The render method here is taking a very simple hash with a key of :plain and value of params[:article].inspect. The params method is the object which represents the parameters (or fields) coming in from the form. The params method returns an ActionController::Parameters object, which allows you to access the keys of the hash using either strings or symbols. 

```ruby
def create
  render plain: params[:article].inspect
end
```

备注：
- This action is now displaying the parameters for the article that are coming in from the form. However, this isn't really all that helpful. Yes, you can see the parameters but nothing in particular is being done with them.

### Creating the Article model

```bash
$ bin/rails generate model Article title:string text:text
```

Migrations are Ruby classes that are designed to make it simple to create and modify database tables. Rails uses rake commands to run migrations, and it's possible to undo a migration after it's been applied to your database. Migration filenames include a timestamp to ensure that they're processed in the order that they were created.

At this point, you can use a bin/rails command to run the migration:

```bash
$ bin/rails db:migrate
```

Rails will execute this migration command and tell you it created the Articles table.

小结：
1. `生成一个 db model 结构，然后运行命令生成一个对应的 table。`

```ruby
def create
  @article = Article.new(params[:article])
 
  @article.save
  redirect_to @article
end
```

### Here's what's going on: every Rails model can be initialized with its `respective attributes, which are automatically mapped to the respective database columns.` In the first line we do just that (remember that params[:article] contains the attributes we're interested in). Then, @article.save is responsible for saving the model in the database. Finally, we redirect the user to the show action, which we'll define later.

We have to whitelist our controller parameters to prevent wrongful mass assignment. In this case, we want to both allow and require the title and text parameters for valid use of create. The syntax for this introduces require and permit. The change will involve one line in the create action: `对每一个输入都有规定和对标。`

```ruby
def create
  
@article = Article.new(params.require(:article).permit(:title, :text))
 
  @article.save
  redirect_to @article
end
```

This is often factored out into its own method so it can be reused by multiple actions in the same controller, for example create and update. Above and beyond mass assignment issues, the method is often made private to make sure it can't be called outside its intended context.

```ruby
    def create
        @article = Article.new(article_params)
       
        @article.save
        redirect_to @article
      end
       
      private
        def article_params
          params.require(:article).permit(:title, :text)
        end
```

### Validation

```ruby

class Article < ApplicationRecord
  validates :title, presence: true,
                    length: { minimum: 5 }
end
```

These changes will ensure that all articles have a title that is at least five characters long. Rails can validate a variety of conditions in a model, including the presence or uniqueness of columns, their format, and the existence of associated objects.

```ruby
def new
  @article = Article.new
end
 
def create
  @article = Article.new(article_params)
 
  if @article.save
    redirect_to @article
  else
    render 'new'
  end
end
 
private
  def article_params
    params.require(:article).permit(:title, :text)
  end
```

- 这里实现了错误输入或者没有输入的情况下，表格会返回，并且把原数据返回。

- Add error messages：

```ruby
<%= form_for :article, url: articles_path do |f| %>
 
  <% if @article.errors.any? %>
    <div id="error_explanation">
      <h2>
        <%= pluralize(@article.errors.count, "error") %> prohibited
        this article from being saved:
      </h2>
      <ul>
        <% @article.errors.full_messages.each do |msg| %>
          <li><%= msg %></li>
        <% end %>
      </ul>
    </div>
  <% end %>
 
  <p>
    <%= f.label :title %><br>
    <%= f.text_field :title %>
  </p>
 
  <p>
    <%= f.label :text %><br>
    <%= f.text_area :text %>
  </p>
 
  <p>
    <%= f.submit %>
  </p>
 
<% end %>
 
<%= link_to 'Back', articles_path %>
```

- 这里使用了类似 array.map 的method。

- 开发节奏 --》 controller -》 template -》 
  - 这里开发了两个 method， 一个是 edit 主要用于跳进 edit view template。
  - 另外一个是 update，主要用于在 edit view 中的 submit 动作。

