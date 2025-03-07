//用户信息数据，函数执行会返回一个数组，数组里包含两个用户信息对象
function createUserList() {
  return {
    status: 0,
    data: [
      {
        token: "Admin Token",
        _id: "641280fdc5ff3cb994002003",
        name: "测试用户1",
        username: "test1",
        password: "1234",
        phone: "13112345678",
        role_id: "640ec59a9f6e3402f8edd4ec",
        create_time: 1678934269969,
        __v: 0,
        role: {
          _id: "640ec59a9f6e3402f8edd4ec",
          name: "管理员",
          menus: [
            "/home",
            "/user",
            "/role",
            "/school",
            "/majors",
            "/student",
            "/class",
          ],
          create_time: 1678689690752,
          __v: 0,
          auth_time: 1678952409061,
          auth_name: "test1",
        },
      },
      {
        token: "System Token",
        _id: "64098cc6984047a6c854b303",
        username: "admin",
        password: "admin",
        create_time: 1678347462193,
        __v: 0,
        role: {
          menus: [],
        },
      },
    ],
  };
}
// 对外暴露一个数组：数组里面一个登录接口
export default [
  // 用户登录接口
  {
    url: "/mock/login", //请求地址
    method: "post", //请求方式
    response: ({ body }) => {
      //获取请求体携带过来的用户名与密码
      const { username, password } = body;
      //调用获取用户信息函数,用于判断是否有此用户
      const checkUser = createUserList().data.find(
        (item) => item.username === username && item.password === password
      );
      //没有用户返回失败信息
      if (!checkUser) {
        return { status: 1, msg: "用户名或密码错误" };
      }
      //如果有返回成功信息

      const { token } = checkUser;
      return { status: 0, data: { token } };
    },
  },
  // 获取用户信息
  {
    url: "/mock/user/info",
    method: "get",
    response: (request) => {
      //获取请求头携带token
      const token = request.headers.token;
      //查看用户信息是否包含有次token用户
      const checkUser = createUserList().data.find(
        (item) => item.token === token
      );
      //没有返回失败的信息
      if (!checkUser) {
        return { status: 1, data: { message: "获取用户信息失败" } };
      }
      //如果有返回成功信息
      return { status: 0, data: { ...checkUser } };
    },
  },
];
