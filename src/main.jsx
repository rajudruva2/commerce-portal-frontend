import React,{useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';

const API='http://localhost:8082/api';

function App(){
  const [summary,setSummary]=useState({});
  const [products,setProducts]=useState([]);
  const [orders,setOrders]=useState([]);
  const [loading,setLoading]=useState(true);
  const [name,setName]=useState('');
  const [price,setPrice]=useState('');
  const [stock,setStock]=useState('');

  async function load(){
    setLoading(true);
    const [s,p,o]=await Promise.all([
      fetch(`${API}/dashboard/summary`).then(r=>r.json()),
      fetch(`${API}/products`).then(r=>r.json()),
      fetch(`${API}/orders`).then(r=>r.json())
    ]);
    setSummary(s);setProducts(p);setOrders(o);setLoading(false);
  }

  useEffect(()=>{load()},[]);

  async function addProduct(e){
    e.preventDefault();
    await fetch(`${API}/products`,{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({name,price:Number(price),stock:Number(stock),description:'Created from admin UI'})
    });
    setName('');setPrice('');setStock('');load();
  }

  async function ship(id){
    await fetch(`${API}/orders/${id}/status?value=SHIPPED`,{method:'PUT'});
    load();
  }

  if(loading) return <div className="loading">Loading ecommerce platform...</div>;

  return <div>
    <header>
      <div><h1>CommerceHub</h1><span>Admin Operations</span></div>
      <button onClick={load}>Refresh</button>
    </header>

    <main>
      <section className="cards">
        <Card title="Products" value={summary.products||0}/>
        <Card title="Customers" value={summary.customers||0}/>
        <Card title="Orders" value={summary.orders||0}/>
        <Card title="Low Stock" value={summary.lowStockProducts||0}/>
        <Card title="Revenue" value={`$${Number(summary.revenue||0).toFixed(2)}`}/>
      </section>

      <section className="grid">
        <div className="panel">
          <h2>Add Product</h2>
          <form onSubmit={addProduct} className="form">
            <input placeholder="Product name" value={name} onChange={e=>setName(e.target.value)} required/>
            <input placeholder="Price" type="number" step="0.01" value={price} onChange={e=>setPrice(e.target.value)} required/>
            <input placeholder="Stock" type="number" value={stock} onChange={e=>setStock(e.target.value)} required/>
            <button>Add Product</button>
          </form>
        </div>

        <div className="panel">
          <h2>Integration</h2>
          <p>Frontend → Spring Boot REST API → PostgreSQL</p>
          <p className="muted">API: {API}</p>
        </div>
      </section>

      <section className="panel">
        <div className="title"><h2>Products</h2><span>{products.length} active</span></div>
        <table><thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Stock</th></tr></thead>
        <tbody>{products.map(p=><tr key={p.id}><td>{p.name}</td><td>{p.category?.name||'—'}</td><td>${Number(p.price).toFixed(2)}</td><td><span className={p.stock<10?'warning':''}>{p.stock}</span></td></tr>)}</tbody></table>
      </section>

      <section className="panel">
        <div className="title"><h2>Recent Orders</h2><span>{orders.length} total</span></div>
        <table><thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>{orders.map(o=><tr key={o.id}><td>#{o.id}</td><td>{o.customer?.name}</td><td>${Number(o.totalAmount).toFixed(2)}</td><td><span className="status">{o.status}</span></td><td>{o.status==='CONFIRMED'&&<button onClick={()=>ship(o.id)}>Ship</button>}</td></tr>)}</tbody></table>
      </section>
    </main>
  </div>
}

function Card({title,value}){return <div className="card"><span>{title}</span><strong>{value}</strong></div>}

createRoot(document.getElementById('root')).render(<App/>);
