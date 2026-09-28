'use client';

import { useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  userProfileSchema,
  type FormState,
  type UserProfileFormData,
  type UserProfileFormInput,
} from '@/lib/schemas';
import { updateUserProfile } from '@/lib/actions';
import { Button } from '@/components/ui/atoms/button';
import { Input } from '@/components/ui/atoms/input';
import { Label } from '@/components/ui/atoms/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/atoms/card';
import { Textarea } from '@/components/ui/atoms/textarea';
import { Loader2, User } from 'lucide-react';
import { useGlobalState } from '@/providers/global-state-provider';

export function ProfileForm() {
  const { user } = useGlobalState();
  const initialState: FormState = { message: '', errors: {} };
  const [state, formAction, isPending] = useActionState(updateUserProfile, initialState);

  const {
    formState: { errors },
  } = useForm<UserProfileFormInput, unknown, UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      age: 25,
      bio: '',
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Update Profile Form
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter your full name"
              disabled={isPending}
              defaultValue={user?.name || ''}
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
            {state.errors?.name && (
              <p className="text-sm text-red-500 mt-1">{state.errors.name[0]}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              disabled={isPending}
              defaultValue={user?.email || ''}
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
            {state.errors?.email && (
              <p className="text-sm text-red-500 mt-1">{state.errors.email[0]}</p>
            )}
          </div>

          <div>
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              name="age"
              type="number"
              placeholder="25"
              disabled={isPending}
              defaultValue="25"
            />
            {errors.age && <p className="text-sm text-red-500 mt-1">{errors.age.message}</p>}
            {state.errors?.age && (
              <p className="text-sm text-red-500 mt-1">{state.errors.age[0]}</p>
            )}
          </div>

          <div>
            <Label htmlFor="bio">Bio (Optional)</Label>
            <Textarea
              id="bio"
              name="bio"
              placeholder="Tell us about yourself..."
              disabled={isPending}
            />
            {errors.bio && <p className="text-sm text-red-500 mt-1">{errors.bio.message}</p>}
            {state.errors?.bio && (
              <p className="text-sm text-red-500 mt-1">{state.errors.bio[0]}</p>
            )}
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating Profile...
              </>
            ) : (
              'Update Profile'
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
