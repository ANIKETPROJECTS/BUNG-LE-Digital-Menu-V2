import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Welcome from "@/pages/welcome";
import MenuLanding from "@/pages/menu-landing";
import CategorySelection from "@/pages/category-selection";
import SubcategoryProducts from "@/pages/subcategory-products";
import CustomerList from "@/pages/customer-list";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Welcome} />
      <Route path="/menu" component={MenuLanding} />
      <Route path="/menu/:category" component={CategorySelection} />
      <Route path="/menu/:category/:subcategory" component={SubcategoryProducts} />
      <Route path="/customers" component={CustomerList} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
