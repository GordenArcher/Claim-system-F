import { Home, Clock, List, Search, CreditCard, PlusCircle, CheckCircle, DollarSign, History, Settings, Users, FileText, ClipboardList, SearchCheck, BarChart } from "lucide-react";
import { ClaimsNav } from "../constants/constant";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { APIContext } from "../utils/context/APIContextProvider";

const icons = {
  "layout-dashboard": Home,
  list: List,
  search: Search,
  "credit-card": CreditCard,
  "plus-circle": PlusCircle,
  clock: Clock,
  "check-circle": CheckCircle,
  "dollar-sign": DollarSign,
  history: History,
  settings: Settings,
  users: Users,
  "file-text": FileText,
  "clipboard-list": ClipboardList,
  "search-check": SearchCheck,
  "bar-chart": BarChart,
};

export const HomeGrid = () => {
    const { user } = useContext(APIContext);

    const filteredNav = ClaimsNav.filter(item => item.roles.includes(user.data?.role));

    return (
        <div className="w-full p-4 md:p-8">
            <div className="container mx-auto">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
                    {filteredNav.map((item, index) => {
                        const Icon = icons[item.icon];
                        return (
                            <Link
                                key={index}
                                to={item.path}
                                className="block w-full outline-none focus:outline-none  rounded-lg group"
                                aria-label={item.title}
                            >
                                <div className="h-full bg-white shadow-sm group-hover:shadow-md rounded-lg overflow-hidden border border-gray-100 group-hover:border-blue-200 transition-all duration-200">
                                    <div className="p-4 md:p-6 flex flex-col items-center justify-center gap-3">
                                        <div className="p-3 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-all duration-200">
                                            <Icon className="w-6 h-6 text-gray-900 group-hover:text-gray-900 transition-all duration-500 group-hover:rotate-360" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-800 group-hover:text-blue-700">{item.title}</span>
                                    </div>
                                    <div className="h-1 w-full bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:from-blue-400 group-hover:via-blue-500 group-hover:to-blue-600 transition-all duration-300"></div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
