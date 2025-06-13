### 当前项目登录流程详解

#### 1. 前端登录表单提交

- 用户在登录页面输入用户名和密码
- 点击登录按钮触发`onSubmit`函数
- 通过 el-form 组件的自定义表单的自定义校验方法，验证通过后调用`userStore.userLogin(form)`方法

#### 2. 前端发送登录请求

```typescript
async userLogin(data: loginFormData) {
  let result: loginResponseData = await reqLogin(data);
  console.log(result);
  if (result.status == 0) {
    // 登录成功，保存用户信息到状态和本地存储
    this.user = result.data as userInfoData;
    localStorage.setItem("D2402-user", JSON.stringify(result.data));
    return "OK";
  } else {
    // 登录失败，返回错误
    return Promise.reject(new Error(result.msg));
  }
}
```

#### 3. 请求拦截器处理

- 虽然请求会经过拦截器，但由于路径是`/login`，根据判断逻辑：
  ```typescript
  if (config.url != "/menus" && config.url != "/login") {
    // 不会执行加载状态和权限验证
  }
  ```
- 因此登录请求**不会触发额外的加载状态显示和权限验证**

#### 4. 后端验证逻辑

- 后端收到请求后，解析用户名和密码
- 查询数据库验证用户凭据
- 验证成功后返回用户对象（包含角色 ID 和权限列表，但不包含 JWT token）
- 验证失败返回错误信息

#### 5. 前端处理响应

- 登录成功后，前端将完整的用户对象通过 pinia 存储在 localStorage 中
- 未使用 JWT token，而是直接通过角色 ID 和权限列表进行权限控制
- 前端后续请求通过请求头携带角色 ID（而非 JWT token）

#### 6. 后续请求的权限验证

- 后续请求会触发拦截器的权限验证逻辑：
  ```typescript
  if (config.url != "/menus" && config.url != "/login") {
    loading.open();
    getMenus(); // 验证用户权限
  }
  ```
- `getMenus()`函数会向后端发送角色 ID，获取最新权限列表
- 通过比较本地存储的权限与后端返回的权限是否一致，实现权限控制，解决如果权限被修改后将被修改的用户踢下线

#### 7. 数据流向总结

1. 用户输入用户名和密码
2. 前端收集表单数据并发送到后端`/login`接口
3. 后端验证用户身份，返回完整的用户对象（包含密码、角色信息等）
4. 前端将用户对象存储在`localStorage`中
5. 后续请求时，前端通过`getMenus()`函数向后端发送角色 ID 获取最新权限
6. 后端返回权限列表，前端进行权限比对

### 当前项目角色管理流程详解

#### 1. 进入角色管理页面

- 用户登录系统后，在左侧导航栏中点击"系统管理"
- 展开后点击"角色管理"选项
- 前端路由导航至`/role`路径
- 页面加载`Role.vue`组件

#### 2. 页面初始化

- 组件挂载后，自动触发`getRoleList`方法
- 该方法调用 API 发送 GET 请求到后端`/manage/role/list`接口
- 后端处理请求并返回角色列表数据
- 前端接收数据后，将角色列表渲染到页面表格中

#### 3. 获取角色列表的 API 请求

```typescript
export const getRoleList = () =>
  request.get<any, getRoleListResponseData>("/manage/role/list");
```

#### 4. 角色列表展示

- 页面使用表格组件展示角色信息，包括角色名称、创建时间等
- 每条记录包含操作按钮：编辑、删除、设置权限

#### 5. 添加新角色

- 用户点击页面中的"添加角色"按钮
- 弹出模态框，要求输入角色名称
- 用户输入角色名称后点击确定
- 前端收集数据并调用`addRole`方法
- 该方法发送 POST 请求到后端`/manage/role/add`接口
- 后端创建新角色并返回结果
- 前端刷新角色列表
- 通过nexttick进行异步显示，数据更改但是页面没更新，手动调用nexttick，确保数据获取的是最新的

#### 6. 编辑角色

- 用户点击角色记录的"编辑"按钮
- 弹出模态框，显示角色当前信息
- 用户修改角色名称后点击确定
- 前端收集数据并调用`updateRole`方法
- 该方法发送 POST 请求到后端`/manage/role/update`接口
- 后端更新角色信息并返回结果
- 前端刷新角色列表

#### 7. 删除角色

- 用户点击角色记录的"删除"按钮
- 弹出确认对话框
- 用户确认后，前端调用`deleteRole`方法
- 该方法发送 POST 请求到后端`/manage/role/delete`接口
- 后端删除角色并返回结果
- 前端刷新角色列表

#### 8. 设置角色权限

- 用户点击角色记录的"设置权限"按钮
- 弹出权限设置模态框
- 模态框中展示权限树结构，用户可以勾选相应权限
- 用户设置完成后点击"确定"按钮
- 前端收集权限数据并调用`updateData`函数更新角色权限
  ```typescript
  const updateData = async () => {
    try {
      // 收集选中的权限列表
      const menus = getCheckedMenus(menuTree);
      // 调用API更新角色权限
      await updateRole({
        _id: currentRole._id,
        menus,
      });
      ElMessage.success("权限更新成功");
      // 关闭模态框
      dialogVisible.value = false;
      // 刷新角色列表
      await getRoleList();
    } catch (error) {
      ElMessage.error("权限更新失败");
    }
  };
  ```
- 后端更新角色权限并返回结果
- 前端关闭模态框并刷新角色列表

#### 9. 数据流向总结

1. 用户导航至角色管理页面
2. 前端发送请求获取角色列表
3. 后端返回角色数据，前端渲染页面
4. 用户执行添加、编辑、删除或设置权限操作
5. 前端收集数据并发送请求到后端相应接口
6. 后端处理请求并返回结果
7. 前端根据结果更新页面或提示用户操作成功/失败

### 当前项目权限管理流程详解

#### 1. 权限系统架构

权限管理基于角色(RBAC)模型，核心要素包括：

- **用户**：系统操作者
- **角色**：定义权限集合的抽象概念(如管理员、教师、学生)
- **菜单**：系统功能入口，关联权限标识
- **权限点**：具体操作权限(如增删改查)

#### 2. 权限数据初始化

1. **后端数据模型**：

   - `RoleModel`存储角色信息和关联菜单
   - `menus`字段存储权限树结构

2. **前端权限树**：
   - 在`Role.vue`组件中定义静态权限树结构
   - 通过递归组件渲染多级菜单

#### 3. 权限分配流程

##### 3.1 创建角色

1. 管理员进入"角色管理"页面
2. 点击"添加角色"按钮
3. 输入角色名称并提交
4. 后端创建新角色记录，默认权限为空

##### 3.2 分配权限

1. 点击角色操作栏的"设置权限"按钮
2. 系统加载权限树组件，展示所有可分配权限
3. 勾选需要的菜单和操作权限
4. 点击"保存"按钮提交权限配置

##### 3.3 后端权限保存

```javascript
// 后端处理权限更新的核心逻辑
router.post("/update", async (req, res) => {
  const { _id, menus } = req.body;
  try {
    await RoleModel.findOneAndUpdate({ _id }, { menus });
    res.send({ status: 0, msg: "权限更新成功" });
  } catch (error) {
    res.send({ status: 1, msg: "权限更新失败" });
  }
});
```

#### 4. 权限验证机制

##### 4.1 前端路由守卫

```typescript
// 路由守卫中验证权限
router.beforeEach((to, from, next) => {
  if (to.path === "/login") {
    return next();
  }

  const user = JSON.parse(localStorage.getItem("D2402-user") || "{}");
  if (!user._id) {
    return next("/login");
  }

  // 检查当前路由是否在用户权限菜单中
  if (!checkPermission(to.path, user.menus)) {
    return next("/403");
  }

  next();
});
```

##### 4.2 请求拦截器验证

```typescript
// axios拦截器中验证权限
if (config.url != "/menus" && config.url != "/login") {
  loading.open();
  // 调用getMenus验证权限
  getMenus();
}
```

##### 4.3 页面元素级权限控制

```vue
<!-- 根据权限显示/隐藏操作按钮 -->
<el-button
  v-if="hasPermission('user:edit')"
  type="primary"
  @click="handleEdit(row)"
>
  编辑
</el-button>
```

#### 5. 权限同步机制

1. **登录时获取权限**：

   - 登录成功后，后端返回完整用户对象(包含角色和权限)
   - 前端将权限信息存储在 localStorage 和 Pinia 中

2. **动态路由生成**：

   - 根据用户权限动态生成侧边栏菜单
   - 过滤掉无权限访问的路由

3. **权限变更处理**：
   - 当角色权限变更时，需用户重新登录获取最新权限
   - 未实现权限实时推送机制

#### 6. 权限数据流向

##### 6.1. 权限分配流程

```
管理员 → 角色管理页面 → 设置权限 → 提交配置 → 后端存储权限数据
```

**详细流程**：

1. **管理员操作**：

   - 管理员登录系统并导航至"角色管理"页面
   - 选择需要配置权限的角色（或创建新角色）
   - 在权限设置模态框中勾选对应的菜单权限

2. **前端处理**：

   - 收集选中的权限项（menus 数组）
   - 调用`updateRole`API 发送到后端

   ```typescript
   export const updateRole = (data: roleInfoData) =>
     request.post<any, updateRoleResponseData>("/manage/role/update", data);
   ```

3. **后端存储**：

   - 后端接收角色 ID 和权限数组
   - 更新 RoleModel 中的 menus 字段
   - 权限数据以树形结构存储在数据库中

4. **数据存储形式**：
   ```javascript
   // 数据库中RoleModel示例
   {
     "_id": "6123456789abcdef",
     "name": "教师",
     "menus": ["user:list", "user:view", "course:add", "course:edit"]
   }
   ```

##### 6.2. 权限验证流程

```
用户请求 → 前端路由守卫/拦截器 → 验证权限 → 允许访问/重定向
```

**详细流程**：

1. **路由守卫验证**：

   - 用户访问页面时触发`router.beforeEach`钩子
   - 验证用户登录状态（通过 localStorage 中的`D2402-user`）
   - 检查当前路由是否在用户权限菜单中

   ```typescript
   // 核心验证逻辑
   if (!user.menus.includes(to.meta.permission)) {
     return next("/403"); // 无权限访问
   }
   ```

2. **请求拦截器验证**：

   - 非登录/菜单请求触发拦截器
   - 调用`getMenus()`函数验证权限
   - 向后端发送角色 ID 获取最新权限列表

   ```typescript
   request({
     url: "/menus",
     method: "post",
     data: { roleId },
   }).then((res) => {
     // 比较本地权限与后端返回权限
     if (!isPermissionMatch(user.menus, res.data.menus)) {
       // 权限变更处理
     }
   });
   ```

3. **元素级权限控制**：
   - 通过自定义指令或方法控制 UI 元素显示
   ```vue
   <el-button v-if="hasPermission('user:delete')">删除</el-button>
   ```

##### 6.3. 菜单生成流程

```
后端存储权限树 → 登录时返回用户权限 → 前端解析权限树 → 生成侧边栏菜单
```

**详细流程**：

1. **后端权限树结构**：

   - 权限以树形结构存储在 RoleModel 的 menus 字段
   - 每个权限节点包含 id、name、children 等属性

2. **登录时获取权限**：

   - 登录成功后，后端返回包含角色和权限的完整用户对象
   - 前端将权限信息存储在 localStorage 和 Pinia 中

3. **前端解析权限树**：

   - 在`App.vue`或导航组件中解析权限树
   - 过滤出用户有权限访问的菜单项

   ```typescript
   const generateMenu = (permissionTree, userPermissions) => {
     return permissionTree.filter(
       (item) =>
         userPermissions.includes(item.id) ||
         (item.children &&
           generateMenu(item.children, userPermissions).length > 0)
     );
   };
   ```

4. **动态生成侧边栏**：

   - 根据解析后的权限树生成侧边栏菜单
   - 无权限的菜单项自动隐藏

   ```vue
   <el-menu :items="menuItems" @select="handleSelect"></el-menu>
   ```

5. **权限变更处理**：
   - 当角色权限变更时，用户需重新登录获取最新权限
   - 前端未实现权限实时推送机制

**补充说明**：

- 权限验证采用前端验证为主，后端验证为辅的策略
- 前端权限验证主要防止 UI 层面的越权访问，敏感操作仍需后端二次验证
- 超级管理员账户（admin）拥有所有权限，不受权限验证限制
