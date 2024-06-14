import {Component} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'

import LoginForm from './components/LoginForm'
import Home from './components/Home'
import Products from './components/Products'
import ProductItemDetails from './components/ProductItemDetails'
import Cart from './components/Cart'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'

import CartContext from './context/CartContext'

import './App.css'

class App extends Component {
  state = {
    cartList: [],
  }

  //   TODO: Add your code for remove all cart items, increment cart item quantity, decrement cart item quantity, remove cart item
  removeAllCartItems = () => {
    this.setState({cartList: []})
  }

  incrementCartItemQuantity = id => {
    this.setState(previous => ({
      cartList: previous.cartList.map(each => {
        if (each.id === id) {
          const updateQuntity = each.quantity + 1
          return {...each, quantity: updateQuntity}
        }
        return each
      }),
    }))
  }

  decrementCartItemQuantity = id => {
    const {cartList} = this.state
    const productsItem = cartList.find(each => each.id === id)
    if (productsItem.quantity > 1) {
      this.setState(previous => ({
        cartList: previous.cartList.map(each => {
          if (each.id === id) {
            const decreseQuantity = each.quantity - 1
            return {...each, quantity: decreseQuantity}
          }
          return each
        }),
      }))
    } else {
      this.removeCartItem(id)
    }
  }

  removeCartItem = id => {
    const {cartList} = this.state
    const updateData = cartList.filter(each => each.id !== id)
    this.setState({cartList: updateData})
  }

  addCartItem = product => {
    const {cartList} = this.state
    const productList = cartList.find(each => each.id === product.id)
    if (productList) {
      this.setState(previous => ({
        cartList: previous.cartList.map(each => {
          if (productList.id === each.id) {
            const updateList = product.quantity + each.quantity
            return {...each, quantity: updateList}
          }
          return each
        }),
      }))
    } else {
      const updateItems = [...cartList, product]
      this.setState({cartList: updateItems})
    }

    //   TODO: Update the code here to implement addCartItem
  }

  render() {
    const {cartList} = this.state

    return (
      <CartContext.Provider
        value={{
          cartList,
          addCartItem: this.addCartItem,
          removeCartItem: this.removeCartItem,
          removeAllCartItems: this.removeAllCartItems,
          incrementCartItemQuantity: this.incrementCartItemQuantity,
          decrementCartItemQuantity: this.decrementCartItemQuantity,
        }}
      >
        <Switch>
          <Route exact path="/login" component={LoginForm} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/products" component={Products} />
          <ProtectedRoute
            exact
            path="/products/:id"
            component={ProductItemDetails}
          />
          <ProtectedRoute exact path="/cart" component={Cart} />
          <Route path="/not-found" component={NotFound} />
          <Redirect to="not-found" />
        </Switch>
      </CartContext.Provider>
    )
  }
}

export default App
