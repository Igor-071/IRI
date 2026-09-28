'use client';

import { useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  invoiceSchema,
  type FormState,
  type InvoiceFormData,
  type InvoiceFormInput,
} from '@/lib/schemas';
import { createInvoice } from '@/lib/actions';
import { Button } from '@/components/ui/atoms/button';
import { Input } from '@/components/ui/atoms/input';
import { Label } from '@/components/ui/atoms/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/atoms/card';
import { Textarea } from '@/components/ui/atoms/textarea';
import { Loader2, Receipt } from 'lucide-react';

export function InvoiceForm() {
  const initialState: FormState = { message: '', errors: {} };
  const [state, formAction, isPending] = useActionState(createInvoice, initialState);

  const {
    register,
    formState: { errors },
    setValue,
    reset,
  } = useForm<InvoiceFormInput, unknown, InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
  });

  // Reset form on successful submission
  if (state.success && !isPending) {
    setTimeout(() => reset(), 2000);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="w-5 h-5" />
          Create Invoice Form
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div>
            <Label htmlFor="customerId">Customer ID</Label>
            <Input
              id="customerId"
              name="customerId"
              placeholder="Enter customer ID"
              disabled={isPending}
            />
            {errors.customerId && (
              <p className="text-sm text-red-500 mt-1">{errors.customerId.message}</p>
            )}
            {state.errors?.customerId && (
              <p className="text-sm text-red-500 mt-1">{state.errors.customerId[0]}</p>
            )}
          </div>

          <div>
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              disabled={isPending}
            />
            {errors.amount && <p className="text-sm text-red-500 mt-1">{errors.amount.message}</p>}
            {state.errors?.amount && (
              <p className="text-sm text-red-500 mt-1">{state.errors.amount[0]}</p>
            )}
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <select
              name="status"
              id="status"
              disabled={isPending}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
            {errors.status && <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>}
            {state.errors?.status && (
              <p className="text-sm text-red-500 mt-1">{state.errors.status[0]}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Invoice description..."
              disabled={isPending}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
            )}
            {state.errors?.description && (
              <p className="text-sm text-red-500 mt-1">{state.errors.description[0]}</p>
            )}
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Invoice...
              </>
            ) : (
              'Create Invoice'
            )}
          </Button>

          {state.message && (
            <div
              className={`text-sm p-3 rounded-md ${
                state.success
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {state.message}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
