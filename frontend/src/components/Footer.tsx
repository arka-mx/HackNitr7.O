import { Facebook, Twitter, Instagram, Linkedin, Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800 mt-auto">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-8 w-8 bg-teal-600 rounded-md flex items-center justify-center text-white font-bold text-xl">
                                O
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-white">Overbilled</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            Empowering patients to fight back against medical overcharging.
                            Our AI analyzes your bills to find errors, savings, and peace of mind.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-teal-400 transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="hover:text-teal-400 transition-colors"><Facebook size={20} /></a>
                            <a href="#" className="hover:text-teal-400 transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="hover:text-teal-400 transition-colors"><Linkedin size={20} /></a>
                        </div>
                    </div>

                    {/* Links Column 1 */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Product</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-teal-400 transition-colors">How It Works</a></li>
                            <li><a href="#" className="hover:text-teal-400 transition-colors">Pricing</a></li>
                            <li><a href="#" className="hover:text-teal-400 transition-colors">Success Stories</a></li>
                            <li><a href="#" className="hover:text-teal-400 transition-colors">FAQ</a></li>
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Company</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-teal-400 transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-teal-400 transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-teal-400 transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-teal-400 transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    {/* Links Column 3 */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-teal-400 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-teal-400 transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-teal-400 transition-colors">Cookie Policy</a></li>
                            <li><a href="#" className="hover:text-teal-400 transition-colors">HIPAA Compliance</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                    <p>© {new Date().getFullYear()} Overbilled AI. All rights reserved.</p>
                    <div className="flex items-center gap-1">
                        <span>Made with</span>
                        <Heart size={12} className="text-red-500 fill-red-500" />
                        <span>for fair billing everywhere.</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
