import {
  ArrowDownRight,
  ArrowUpRight,
  Tags,
  Utensils,
  Car,
  ShoppingBag,
  Receipt,
  Wallet,
  Briefcase,
  Heart,
  Home,
  Plane,
  GraduationCap,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddCategoryDialog } from "@/components/add-category-dialog";
import { CategoryActions } from "@/components/category-action";

const iconMap = {
  Utensils,
  Car,
  ShoppingBag,
  Receipt,
  Wallet,
  Briefcase,
  Heart,
  Home,
  Plane,
  GraduationCap,
};

function getCategoryIcon(icon: string | null) {
  const Icon = iconMap[icon as keyof typeof iconMap] ?? Tags;

  return Icon;
}

export default async function CategoriesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    console.error("Failed to fetch categories:", error);
  }

  const categoryList = categories ?? [];

  const incomeCategories = categoryList.filter(
    (category) => category.type === "income",
  );

  const expenseCategories = categoryList.filter(
    (category) => category.type === "expense",
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Tags className="h-5 w-5 text-primary" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            Organize your income and expenses with custom categories.
          </p>
        </div>

        <AddCategoryDialog />
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Categories
            </CardTitle>

            <Tags className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-bold">{categoryList.length}</p>

            <p className="mt-1 text-xs text-muted-foreground">
              Your custom categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Expense Categories
            </CardTitle>

            <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-bold">{expenseCategories.length}</p>

            <p className="mt-1 text-xs text-muted-foreground">
              Used for tracking expenses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Income Categories
            </CardTitle>

            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-bold">{incomeCategories.length}</p>

            <p className="mt-1 text-xs text-muted-foreground">
              Used for tracking income
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Your Categories</CardTitle>

          <p className="text-sm text-muted-foreground">
            Manage the categories used in your transactions.
          </p>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="expense">
            <TabsList className="mb-6">
              <TabsTrigger value="expense">
                Expenses
                <Badge variant="secondary" className="ml-2">
                  {expenseCategories.length}
                </Badge>
              </TabsTrigger>

              <TabsTrigger value="income">
                Income
                <Badge variant="secondary" className="ml-2">
                  {incomeCategories.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            {/* Expense */}
            <TabsContent value="expense">
              <CategoryGrid categories={expenseCategories} />
            </TabsContent>

            {/* Income */}
            <TabsContent value="income">
              <CategoryGrid categories={incomeCategories} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function CategoryGrid({ categories }: { categories: any[] }) {
  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Tags className="h-6 w-6 text-muted-foreground" />
        </div>

        <h3 className="mt-4 font-semibold">No categories yet</h3>

        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Create a category to organize your transactions.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => {
        const Icon = getCategoryIcon(category.icon);

        return (
          <Card
            key={category.id}
            className="group transition-shadow hover:shadow-md"
          >
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex min-w-0 items-center gap-3">
                {/* Icon */}
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: category.color
                      ? `${category.color}20`
                      : undefined,
                    color: category.color || undefined,
                  }}
                >
                  <Icon className="h-5 w-5" />
                </div>

                {/* Name */}
                <div className="min-w-0">
                  <p className="truncate font-medium">{category.name}</p>

                  <p className="text-xs text-muted-foreground">
                    {category.type === "expense" ? "Expense" : "Income"}
                  </p>
                </div>
              </div>

              {/* Category Actions */}
              <CategoryActions
                categoryId={category.id}
                categoryName={category.name}
              />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
