import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import { NavLink } from 'react-router-dom';
import { MAIN_ROUTES } from '../../constants/routes';
import { connect } from 'react-redux';
import Logout from './Logout';
import mainLogo from '../../img/something.jpg';

const { Header, Sider, Content } = Layout;

const { SubMenu } = Menu;

class NavLayout extends React.Component {
  state = {
    collapsed: false
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  render() {
    return (
      <Layout style={{ height: '100vh' }}>
        <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
          <div className="logo" />
          {this.state.collapsed ? (
            <div className="box-for-image">
              <img className="image-url" src={mainLogo} alt="" />
            </div>
          ) : (
            <div className="box-for-logo">
              <div style={{ position: 'fixed' }} className="font-title-logo">
                VENTURE CREATIONS
              </div>
              <div style={{ position: 'fixed' }} className="font-subtitle-logo">
                RIT's Technology Business Incubator
              </div>
            </div>
          )}

          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[this.props.path]}
          >
            {MAIN_ROUTES.map(({ name, path, icon }) => (
              <Menu.Item key={path}>
                <NavLink to={path}>
                  <Icon type={icon} />
                  <span>{name}</span>
                </NavLink>
              </Menu.Item>
            ))}
            <Menu.Divider style={{backgroundColor: '#313C4E'}}/>
            {/* <div style={{ padding: '10px', fontSize: '.8em' }}>Settings</div> */}
            <Menu.Item key="5">
              <NavLink to="/main-settings">
                <Icon type="setting" />
                <span>Main Settings</span>
              </NavLink>
            </Menu.Item>
            {this.props.isAdmin && (
              <SubMenu
                key="sub1"
                title={
                  <span>
                    <Icon type="plus-square" />
                    <span>Admin</span>
                  </span>
                }
              >
                <Menu.Item key="6">
                  <NavLink to="/company">Companies</NavLink>
                </Menu.Item>
                <Menu.Item key="7">
                  <NavLink to="/people">Users</NavLink>
                </Menu.Item>
              </SubMenu>
            )}
          </Menu>
        </Sider>
        <Layout>
          <Header
            style={{
              background: '#f06f32',
              padding: 0,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Icon
              className="trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
            <div className="logout">
              <Logout />
            </div>
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              background: '#fff'
            }}
          >
            {this.props.children}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default connect((state = {}) => ({
  isAdmin: state.user && state.user.accessLevelID <= 1
}))(NavLayout);
