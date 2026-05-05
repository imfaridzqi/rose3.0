import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { useUsers, useCreateUser, useDeleteUser } from "@/hooks/useUsers"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
})

type FormValues = z.infer<typeof schema>

export function UsersPage() {
  const { data: users, isLoading } = useUsers()
  const createUser = useCreateUser()
  const deleteUser = useDeleteUser()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: FormValues) => {
    createUser.mutate(data, { onSuccess: () => reset() })
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <motion.h1
        className="text-3xl font-bold"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Users
      </motion.h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 border rounded-lg p-4">
        <div>
          <input
            {...register("name")}
            placeholder="Name"
            className="w-full border rounded px-3 py-2 text-sm"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <input
            {...register("email")}
            placeholder="Email"
            className="w-full border rounded px-3 py-2 text-sm"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <Button type="submit" disabled={createUser.isPending}>
          {createUser.isPending ? "Adding..." : "Add User"}
        </Button>
      </form>

      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <ul className="space-y-2">
          {users?.map((user) => (
            <motion.li
              key={user.id}
              className="flex items-center justify-between border rounded-lg px-4 py-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteUser.mutate(user.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  )
}
