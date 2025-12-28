import { useState } from "react";
import { CreditCard, Shield, Check, AlertCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PaymentIntegrationProps {
  amount: number;
  title: string;
  type: "course" | "subscription";
  period?: "monthly" | "yearly";
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const PaymentIntegration = ({ 
  amount, 
  title, 
  type, 
  period, 
  onSuccess, 
  onCancel 
}: PaymentIntegrationProps) => {
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "gumroad">("stripe");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentComplete(true);
      onSuccess?.();
    }, 2000);
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (paymentComplete) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
          <p className="text-muted-foreground mb-6">
            {type === "course" 
              ? "You now have access to this course. Start learning!"
              : "Your subscription is now active. You'll receive alerts and updates."
            }
          </p>
          <Button onClick={onSuccess} className="w-full">
            {type === "course" ? "Start Learning" : "View Subscription"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="font-medium">{title}</span>
            <span className="font-semibold">{formatAmount(amount)}</span>
          </div>
          {period && (
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Billing Period</span>
              <span className="capitalize">{period}</span>
            </div>
          )}
          <div className="border-t pt-2">
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{formatAmount(amount)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Choose Payment Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={paymentMethod === "stripe" ? "default" : "outline"}
              onClick={() => setPaymentMethod("stripe")}
              className="h-16 flex-col gap-1"
            >
              <CreditCard className="h-5 w-5" />
              <span className="text-sm">Stripe</span>
            </Button>
            <Button
              variant={paymentMethod === "gumroad" ? "default" : "outline"}
              onClick={() => setPaymentMethod("gumroad")}
              className="h-16 flex-col gap-1"
            >
              <ExternalLink className="h-5 w-5" />
              <span className="text-sm">Gumroad</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Secure Payment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentMethod === "stripe" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="card-number">Card Number</Label>
                <Input
                  id="card-number"
                  placeholder="1234 5678 9012 3456"
                  disabled={isProcessing}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    disabled={isProcessing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    placeholder="123"
                    disabled={isProcessing}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Cardholder Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  disabled={isProcessing}
                />
              </div>
            </>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You'll be redirected to Gumroad to complete your purchase securely.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 text-green-600" />
            <span>Your payment information is encrypted and secure</span>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button 
          variant="outline" 
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button 
          onClick={handlePayment}
          disabled={isProcessing}
          className="flex-1"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Processing...
            </>
          ) : (
            `Pay ${formatAmount(amount)}`
          )}
        </Button>
      </div>

      {/* Trust Badges */}
      <div className="flex justify-center items-center gap-4 pt-4">
        <Badge variant="outline" className="text-xs">
          <Shield className="h-3 w-3 mr-1" />
          SSL Secured
        </Badge>
        <Badge variant="outline" className="text-xs">
          30-Day Guarantee
        </Badge>
        <Badge variant="outline" className="text-xs">
          Cancel Anytime
        </Badge>
      </div>

      {/* Disclaimer */}
      <div className="text-xs text-muted-foreground text-center space-y-1">
        <p>By completing this purchase, you agree to our Terms of Service and Privacy Policy.</p>
        <p>
          {type === "subscription" 
            ? `You will be charged ${formatAmount(amount)} ${period}. Cancel anytime.`
            : "One-time payment. Lifetime access included."
          }
        </p>
      </div>
    </div>
  );
};

// Stripe Integration Hook (placeholder)
export const useStripeIntegration = () => {
  const createPaymentIntent = async (amount: number, currency = "usd") => {
    // In a real implementation, this would call your backend API
    // which would create a payment intent with Stripe
    console.log("Creating Stripe payment intent for", amount, currency);
    
    return {
      clientSecret: "pi_mock_client_secret",
      status: "requires_payment_method"
    };
  };

  const confirmPayment = async (clientSecret: string, paymentMethod: any) => {
    // In a real implementation, this would confirm the payment with Stripe
    console.log("Confirming Stripe payment", clientSecret, paymentMethod);
    
    return {
      paymentIntent: {
        status: "succeeded"
      }
    };
  };

  return { createPaymentIntent, confirmPayment };
};

// Gumroad Integration Hook (placeholder)
export const useGumroadIntegration = () => {
  const createCheckoutUrl = (productId: string, affiliateCode?: string) => {
    // In a real implementation, this would generate a Gumroad checkout URL
    const baseUrl = "https://gumroad.com/l/";
    const params = new URLSearchParams();
    
    if (affiliateCode) {
      params.append("a", affiliateCode);
    }
    
    const queryString = params.toString();
    return `${baseUrl}${productId}${queryString ? `?${queryString}` : ""}`;
  };

  const redirectToCheckout = (productId: string, affiliateCode?: string) => {
    const url = createCheckoutUrl(productId, affiliateCode);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return { createCheckoutUrl, redirectToCheckout };
};
