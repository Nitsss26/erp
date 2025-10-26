import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';
import { PlusIcon, TrashIcon } from '../../Icons';
import type { StoreItem, Student, Staff, Sale } from '../../../types';

interface CartItem extends StoreItem {
    quantity: number;
}
interface Customer {
    _id: string;
    name: string;
    userID: string;
    type: 'students' | 'teachers';
}

const RecordSale: React.FC = () => {
    const [inventory, setInventory] = useState<StoreItem[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<string>('');
    const [amountPaid, setAmountPaid] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const fetchData = useCallback(async () => {
        try {
            const [itemRes, studentRes, teacherRes] = await Promise.all([
                api.get('/store/items'),
                api.get('/students'),
                api.get('/teachers')
            ]);
            setInventory(itemRes.data);
            const studentCustomers: Customer[] = (studentRes.data || []).map((s: any) => ({ ...s, name: `${s.name} ${s.surname}`, type: 'students' }));
            const teacherCustomers: Customer[] = teacherRes.data.map((t: any) => ({ ...t, name: `${t.name} ${t.surname}`, type: 'teachers' }));
            setCustomers([...studentCustomers, ...teacherCustomers]);
        } catch (err) {
            setError('Failed to load initial data.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData() }, [fetchData]);

    const addToCart = (item: StoreItem) => {
        setCart(prev => {
            const existing = prev.find(i => i._id === item._id);
            if (existing) {
                if(existing.quantity < item.stockQuantity) {
                    return prev.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
                }
                return prev;
            }
            if(item.stockQuantity > 0) {
                return [...prev, { ...item, quantity: 1 }];
            }
            return prev;
        });
    };

    const removeFromCart = (itemId: string) => {
        setCart(prev => prev.filter(i => i._id !== itemId));
    };
    
    const totalAmount = cart.reduce((sum, item) => sum + (item.sellingPrice * item.quantity), 0);

    const handleSubmitSale = async () => {
        if (cart.length === 0 || !selectedCustomer) {
            setError("Please add items to cart and select a customer.");
            return;
        }
        setError('');
        try {
            const customer = customers.find(c=>c._id === selectedCustomer);
            const salePayload: Partial<Sale> = {
                customer: { _id: selectedCustomer, name: customer?.name || '', userID: customer?.userID || '' },
                customerType: customer?.type,
                soldBy: { _id: 'mockadminid', name: 'Admin' }, // Placeholder for logged in user
                items: cart.map(item => ({ itemID: item._id, quantity: item.quantity, priceAtSale: item.sellingPrice, totalAmount: item.sellingPrice * item.quantity })),
                totalAmount,
                amountPaid: totalAmount, // Assuming full payment
                balance: 0,
            };
            await api.post('/store/sales/create', salePayload);

            alert('Sale recorded successfully!');
            setCart([]);
            setSelectedCustomer('');
            setAmountPaid(0);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to record sale.');
        }
    };


    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-[--card] p-6 rounded-xl shadow-sm border border-[--card-border]">
                <h2 className="text-xl font-semibold text-[--text-primary] mb-4">Record Store Sale</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {inventory.map(item => (
                        <button key={item._id} onClick={() => addToCart(item)} disabled={item.stockQuantity === 0} className="p-4 border border-[--card-border] rounded-lg text-center hover:bg-orange-100/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            <p className="font-semibold text-[--text-primary]">{item.name}</p>
                            <p className="text-sm text-[--text-secondary]">₹{item.sellingPrice.toFixed(2)}</p>
                            <p className={`text-xs ${item.stockQuantity <= item.lowStockThreshold ? 'text-red-500' : 'text-gray-400'}`}>Stock: {item.stockQuantity}</p>
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-[--card] p-6 rounded-xl shadow-sm border border-[--card-border]">
                <h3 className="text-lg font-semibold mb-4 text-[--text-primary]">Current Sale</h3>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <div className="space-y-2 mb-4 max-h-64 overflow-y-auto pr-2">
                    {cart.map(item => (
                        <div key={item._id} className="flex justify-between items-center bg-[--table-row-even] p-2 rounded-md">
                            <div>
                                <p className="font-medium text-[--text-primary]">{item.name} <span className="text-xs text-[--text-secondary]">(x{item.quantity})</span></p>
                                <p className="text-sm text-gray-500">₹{(item.sellingPrice * item.quantity).toFixed(2)}</p>
                            </div>
                            <button onClick={() => removeFromCart(item._id)} className="text-red-500 hover:text-red-700"><TrashIcon className="w-5 h-5" /></button>
                        </div>
                    ))}
                    {cart.length === 0 && <p className="text-center text-[--text-secondary] py-10">Cart is empty</p>}
                </div>
                <hr className="my-4 border-[--card-border]"/>
                <div className="space-y-4">
                    <select value={selectedCustomer} onChange={e => setSelectedCustomer(e.target.value)} className="w-full p-2 border border-[--card-border] rounded bg-[--background]">
                        <option value="">Select Customer</option>
                        {customers.map(c => <option key={c._id} value={c._id}>{c.name} ({c.userID})</option>)}
                    </select>
                    <div className="flex justify-between font-bold text-xl text-[--text-primary]">
                        <span>Total:</span>
                        <span>₹{totalAmount.toFixed(2)}</span>
                    </div>
                     <button onClick={handleSubmitSale} disabled={cart.length === 0 || !selectedCustomer} className="w-full bg-green-500 text-white p-3 rounded-lg font-semibold hover:bg-green-600 transition disabled:opacity-50">Complete Sale</button>
                </div>
            </div>
        </div>
    );
};

export default RecordSale;
