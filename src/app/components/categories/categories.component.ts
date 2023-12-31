import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { Category } from "../../interfaces/category";
import { AuthService } from "../../services/auth.service";
import { CategoryService } from "../../services/category.service";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent {

  constructor(private authService: AuthService,
    private router: Router,
    private categoryService: CategoryService) { }

  categories: Category[] = [];
  form!: FormGroup;
  name!: string;
  newCategory = Object()

  ngOnInit() {

    this.authService.isLoggedIn();

    this.categoryService.getAllCategories().subscribe(res => {
      this.categories = res
    });

    this.form = new FormGroup({
      name: new FormControl()
    });

  }

  saveCategory() {
    this.name = this.form.get("name")?.value;
    if (this.name != null) {
      this.newCategory.name = this.name;
      this.categoryService.saveCategory(this.name).subscribe(() => {
        this.categories.push(this.newCategory);
      });
    }
  }

  editCategory(id: number) {
    const name: string | null = this.form.get('name')?.value;
    const index = this.categories.findIndex(cat => cat.id === id);
    this.categoryService.editCategory(id, name).subscribe(res => {
      this.categories[index].name = res.category.name
    });
  }

  deleteCategory(id: number) {
    const index = this.categories.findIndex(cat => cat.id === id);
    this.categoryService.deleteCategory(id).subscribe(() => {
      this.categories.splice(index, 1)
    });
  }

}
