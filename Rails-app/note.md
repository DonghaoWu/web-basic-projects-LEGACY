从一个 route 跳到另外一个 route：

1. route总表：
      Prefix Verb   URI Pattern                  Controller#Action
    articles GET    /articles(.:format)          articles#index
             POST   /articles(.:format)          articles#create
 new_article GET    /articles/new(.:format)      articles#new
edit_article GET    /articles/:id/edit(.:format) articles#edit
     article GET    /articles/:id(.:format)      articles#show
             PATCH  /articles/:id(.:format)      articles#update
             PUT    /articles/:id(.:format)      articles#update
             DELETE /articles/:id(.:format)      articles#destroy
        root GET    /  

2. 在 controller 之下可以定义 #index #create #new  #edit  #show  #update  #update  #destroy，如果没有定义函数，就会自动找到 views 文件夹下面同名文件，有定义函数就直接执行函数。

3. 在本例中，#new 是指向一个 template，于是 `GET    /articles/new` 通往这个 template  ，template 中设定：

    ```html
    <%= form_for :article, url: articles_path do |f| %>
    ```
    - 这样 form 在 submit 的时候就会指向路径 `/articles/`, 同时默认 submit 产生一个 `POST action`

4. 这样就通过上面在按下 submit 的时候跳到另外一个 `articles#create`

5. __所以目前的看法是，只要符合 verb 和 URI， 就会激发 action。__`The articles_path helper tells Rails to point the form to the URI Pattern associated with the articles prefix; and the form will (by default) send a POST request to that route. This is associated with the create action of the current controller, the ArticlesController.`

6. 
```ruby
def create
  @article = Article.new(params[:article])
 
  @article.save
  redirect_to @article
end
```
- Here's what's going on: every Rails model can be initialized with its respective attributes, which are automatically mapped to the respective database columns. In the first line we do just that (remember that params[:article] contains the attributes we're interested in). Then, @article.save is responsible for saving the model in the database. Finally, we redirect the user to the show action, which we'll define later.`为什么最后一句是通向 show action？，目前理解它只是往下传递了一个参数。`

    - `Here's what's going on: every Rails model can be initialized with its respective attributes, which are automatically mapped to the respective database columns. In the first line we do just that (remember that params[:article] contains the attributes we're interested in). Then, @article.save is responsible for saving the model in the database. Finally, we redirect the user to the show action, which we'll define later.`  这是很重要的解释，后面补充。

    - 6月4日补充，老师还没有给出答复。自我了解的答案是这是一个缩写：

    ```ruby
    redirect_to @article
    ```

    - 相当于：

    ```ruby
    redirect_to article_path(@article)
    ```

    - 其中 `@article`现在相当于是一个 :id，然后可以在这其中获得一个新的`URI`，然后整一句的意思是跳转至：`/articles/:id`，verb 默认为 `GET`.
    - 根据总表的设计，可以知道这个 `URI 加上 GET`，对应激发的是 `show action`。

7. 关于 Link to 的设计也是很有特色：

```ruby

<%= link_to 'My Blog', controller: 'articles' %> ## 导向 index action

<%= link_to 'Back', articles_path %> ## 导向 index action 

<%= link_to 'New article', new_article_path %>  ## 导向 new action 

<tr>
    <td><%= link_to 'Show', article_path(article) %></td>  ## 导向 show action
    <td><%= link_to 'Edit', edit_article_path(article) %></td> # 导向 edit action
    <td><%= link_to 'Destroy', article_path(article),
              method: :delete,
              data: { confirm: 'Are you sure?' } %></td>  ## 导向 destroy action： verb（delete），uri（article_path(article)）
</tr>

redirect_to @article  ## 导向 show action，并以 参数里面的 id 作为 uri 的一部分。

```

8. 从整个 tutorial 来看，导向一个 action 的方式是有多种，后面如果需要用到的时候要多关注。

9. 这个 tutorial 的另外一个难点是建立 database 之间的层级关系。（articales 与 comments），还有在 form 形式下的显示 comment 代码。

10. 

    
