import os
import shutil

# Tự động cài đặt thư viện nếu thiếu
required_libs = ['PIL', 'imagehash', 'cv2', 'numpy', 'tk']
for lib in required_libs:
    try:
        __import__(lib if lib != 'cv2' else 'cv2')
    except ImportError:
        os.system(f"pip install {lib}")
        
import tkinter as tk
from tkinter import filedialog, messagebox
from PIL import Image, ImageTk
import hashlib
import cv2
import imagehash
from PIL import Image as PILImage
import numpy as np

def upscale_image(img_path):
    img = cv2.imread(img_path)
    height, width = img.shape[:2]
    upscaled = cv2.resize(img, (width*2, height*2), interpolation=cv2.INTER_CUBIC)
    cv2.imwrite(img_path, upscaled)

class DuplicateImageFinder:
    def __init__(self, master):
        self.master = master
        master.title("Tìm ảnh trùng lặp")
        master.geometry("1200x700")

        self.frame_top = tk.Frame(master)
        self.frame_top.pack(pady=10)

        self.choose_button = tk.Button(self.frame_top, text="Chọn thư mục", command=self.choose_folder, bg="lightblue", font=('Arial', 12, 'bold'))
        self.choose_button.pack(side=tk.LEFT, padx=10)

        self.delete_button = tk.Button(self.frame_top, text="Xoá ảnh trùng", command=self.delete_selected_duplicates, bg="lightcoral", font=('Arial', 12, 'bold'))
        self.delete_button.pack(side=tk.LEFT, padx=10)

        self.rename_button = tk.Button(self.frame_top, text="Đổi tên ảnh giữ lại", command=self.rename_image, bg="lightgreen", font=('Arial', 12, 'bold'))
        self.rename_button.pack(side=tk.LEFT, padx=10)

        self.upscale_button = tk.Button(self.frame_top, text="Nâng cao chất lượng ảnh", command=self.upscale_image, bg="gold", font=('Arial', 12, 'bold'))
        self.upscale_button.pack(side=tk.LEFT, padx=10)

        self.frame_main = tk.Frame(master)
        self.frame_main.pack(fill=tk.BOTH, expand=True)

        self.left_panel = tk.Frame(self.frame_main)
        self.left_panel.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=10)

        self.right_panel = tk.Frame(self.frame_main)
        self.right_panel.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True, padx=10)

        self.dup_label = tk.Label(self.left_panel, text="Các file ảnh trùng lặp", font=('Arial', 12, 'bold'))
        self.dup_label.pack()
        self.dup_listbox = tk.Listbox(self.left_panel, selectmode=tk.MULTIPLE, width=100, height=15)
        self.dup_listbox.pack()
        self.dup_listbox.bind('<<ListboxSelect>>', self.show_preview)

        self.keep_label = tk.Label(self.left_panel, text="Các file ảnh được giữ lại", font=('Arial', 12, 'bold'))
        self.keep_label.pack(pady=(20, 0))
        self.keep_listbox = tk.Listbox(self.left_panel, width=100, height=15)
        self.keep_listbox.pack()
        self.keep_listbox.bind('<<ListboxSelect>>', self.show_keep_preview)

        self.image_preview_frame = tk.Frame(self.right_panel)
        self.image_preview_frame.pack(pady=10)

        self.label1 = tk.Label(self.image_preview_frame, text="Ảnh trùng lặp 1", font=('Arial', 10, 'bold'))
        self.label1.grid(row=0, column=0)

        self.label2 = tk.Label(self.image_preview_frame, text="Ảnh trùng lặp 2", font=('Arial', 10, 'bold'))
        self.label2.grid(row=0, column=1)

        self.image1_label = tk.Label(self.image_preview_frame)
        self.image1_label.grid(row=1, column=0, padx=10)

        self.image2_label = tk.Label(self.image_preview_frame)
        self.image2_label.grid(row=1, column=1, padx=10)

        self.keep_image_text = tk.Label(self.right_panel, text="", font=('Arial', 10, 'bold'))
        self.keep_image_text.pack()

        self.keep_image_label = tk.Label(self.right_panel)
        self.keep_image_label.pack(pady=(10, 0))

        self.reset()

    def reset(self):
        self.hash_dict = {}
        self.duplicates = []
        self.folder_path = None
        self.dup_listbox.delete(0, tk.END)
        self.keep_listbox.delete(0, tk.END)
        self.image1_label.config(image='')
        self.image2_label.config(image='')
        self.keep_image_label.config(image='')
        self.keep_image_text.config(text='')

    def choose_folder(self):
        self.reset()
        folder = filedialog.askdirectory()
        if folder:
            self.folder_path = folder
            self.scan_images()

    def scan_images(self):
        self.hash_dict.clear()
        self.duplicates.clear()
        files = [f for f in os.listdir(self.folder_path) if f.lower().endswith(('png', 'jpg', 'jpeg'))]
        for file in files:
            path = os.path.join(self.folder_path, file)
            try:
                image = PILImage.open(path)
                hash_val = str(imagehash.average_hash(image))
                if hash_val in self.hash_dict:
                    self.duplicates.append((self.hash_dict[hash_val], file))
                else:
                    self.hash_dict[hash_val] = file
            except:
                continue

        if not self.duplicates:
            messagebox.showinfo("Kết quả", "Không tìm thấy ảnh trùng lặp trong thư mục này.")

        for i, (f1, f2) in enumerate(self.duplicates, start=1):
            self.dup_listbox.insert(tk.END, f"Trùng file ảnh thứ {i}: {f1} <=> {f2}")

    def show_preview(self, event):
        selected = self.dup_listbox.curselection()
        if not selected:
            return
        idx = selected[-1]  # ảnh cuối cùng được chọn
        f1, f2 = self.duplicates[idx]
        self.display_image(os.path.join(self.folder_path, f1), self.image1_label)
        self.display_image(os.path.join(self.folder_path, f2), self.image2_label)

    def show_keep_preview(self, event):
        selected = self.keep_listbox.curselection()
        if not selected:
            return
        idx = selected[0]
        filename = self.keep_listbox.get(idx).replace("Ảnh giữ lại: ", "")
        path = os.path.join(self.folder_path, filename)
        self.display_image(path, self.keep_image_label)
        self.keep_image_text.config(text=f"Ảnh giữ lại: {filename}")

    def display_image(self, path, widget):
        try:
            img = PILImage.open(path)
            img.thumbnail((300, 240))
            photo = ImageTk.PhotoImage(img)
            widget.image = photo
            widget.config(image=photo)
        except:
            pass

    def delete_selected_duplicates(self):
        selected_indices = list(self.dup_listbox.curselection())
        if not selected_indices:
            return
        for idx in reversed(selected_indices):
            keep_file, del_file = self.duplicates[idx]
            try:
                os.remove(os.path.join(self.folder_path, del_file))
                self.keep_listbox.insert(tk.END, f"Ảnh giữ lại: {keep_file}")
                self.dup_listbox.delete(idx)
                del self.duplicates[idx]
            except:
                messagebox.showerror("Lỗi", f"Không thể xoá ảnh: {del_file}")

    def rename_image(self):
        selected = self.keep_listbox.curselection()
        if not selected:
            return
        idx = selected[0]
        filename = self.keep_listbox.get(idx).replace("Ảnh giữ lại: ", "")
        path = os.path.join(self.folder_path, filename)
        new_name = filedialog.asksaveasfilename(initialdir=self.folder_path, title="Đặt tên mới", defaultextension=".jpg",
                                                 filetypes=[("JPEG files", "*.jpg *.jpeg"), ("PNG files", "*.png")])
        if new_name:
            shutil.copy(path, new_name)
            messagebox.showinfo("Đổi tên", f"Ảnh đã được đổi tên thành: {os.path.basename(new_name)}")

    def upscale_image(self):
        selected = self.keep_listbox.curselection()
        if not selected:
            return
        idx = selected[0]
        filename = self.keep_listbox.get(idx).replace("Ảnh giữ lại: ", "")
        path = os.path.join(self.folder_path, filename)
        try:
            upscale_image(path)
            messagebox.showinfo("Nâng cao chất lượng", f"Ảnh {filename} đã được nâng cấp độ phân giải")
            self.display_image(path, self.keep_image_label)
        except:
            messagebox.showerror("Lỗi", "Không thể nâng cao chất lượng ảnh")

if __name__ == '__main__':
    root = tk.Tk()
    app = DuplicateImageFinder(root)
    root.mainloop()
