import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import { NavLink } from 'react-router-dom';
import { MAIN_ROUTES } from '../../constants/routes';
import { connect }from 'react-redux'
import Logout from './Logout';

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
            
            <div style={{ padding: '10px' }}>Settings</div>
            <Menu.Item key="5">
              <NavLink to="/main-settings">
                <Icon type="setting" />
                <span>Main Settings</span>
              </NavLink>
            </Menu.Item>
            {/* { this.props.isAdmin &&  */
            <SubMenu
            key="sub1"
            title={
              <span>
                <Icon type="plus-square" />
                <span>Admin</span>
              </span>
            }
            >
            <Menu.Item key="6"><NavLink to="/company">Company</NavLink></Menu.Item>
            <Menu.Item key="7"><NavLink to="/people">People</NavLink></Menu.Item>
          </SubMenu>
            }
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#f06f32', padding: 0 }}>
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

export default connect((state = {}) => ({ isAdmin: state.user }))(NavLayout); 
