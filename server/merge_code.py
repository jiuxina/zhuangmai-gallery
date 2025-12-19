import os
import sys

# ================= 配置区域 =================

# 1. 扫描的目标目录 ('.' 表示当前目录)
SOURCE_DIR = '.'

# 2. 输出文件名
OUTPUT_FILE = 'ALL_CODE_MERGED.txt'

# 3. 【核心配置】代码文件后缀白名单
# 只有后缀名在这个列表里的文件才会被视为“代码文件”并进行整合
# 你可以根据你的项目语言，自由增加或删除
CODE_EXTENSIONS = {
    # Web 前端
    '.html', '.htm', '.css', '.scss', '.sass', '.less',
    '.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte',
    '.json',  # 如果不需要合并 json 配置文件，可以注释掉这一行
    
    # 后端 / 脚本
    '.py', '.pyw',
    '.java', '.kt', '.groovy',
    '.rb', '.php', '.pl', '.sh', '.bat', '.cmd', '.ps1',
    '.go', '.rs', '.dart', '.lua',
    
    # C/C++ / C#
    '.c', '.h', '.cpp', '.hpp', '.cc', '.cxx',
    '.cs',
    
    # 移动端
    '.swift', '.m', '.mm',
    
    # 数据库 / 配置 / 文档
    '.sql',
    '.yaml', '.yml', '.toml', '.xml', '.gradle', '.properties',
    '.md', '.txt', '.ini', '.conf'
}

# 4. 需要忽略的目录名 (完全匹配)
# 即使目录下有代码文件，如果目录名在这里，也会直接跳过整个目录
IGNORE_DIRS = {
    '.git', '.idea', '.vscode', '.svn', '.hg',
    '__pycache__', 'node_modules', 'bower_components',
    'venv', 'env', '.env', 'virtualenv',
    'dist', 'build', 'target', 'out', 'bin', 'obj',
    'logs', 'coverage', 'tmp', 'temp'
}

# ===========================================

def merge_files(source_dir, output_file):
    count = 0
    total_lines = 0
    
    # 获取输出文件的绝对路径，防止扫描时把它自己也扫进去（虽然有后缀限制，但为了保险）
    output_abs_path = os.path.abspath(output_file)

    with open(output_file, 'w', encoding='utf-8') as outfile:
        
        # 遍历目录
        for root, dirs, files in os.walk(source_dir):
            
            # 1. 原地修改 dirs 列表，过滤掉不需要扫描的文件夹
            dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
            
            for filename in files:
                filepath = os.path.join(root, filename)
                abs_filepath = os.path.abspath(filepath)

                # 防止把自己写入自己
                if abs_filepath == output_abs_path:
                    continue

                # 获取文件后缀 (转为小写比较)
                _, ext = os.path.splitext(filename)
                ext = ext.lower()

                # 【白名单检查】如果后缀不在允许列表中，直接跳过
                if ext not in CODE_EXTENSIONS:
                    continue

                # 获取相对路径，用于标注
                relative_path = os.path.relpath(filepath, source_dir)

                try:
                    # 读取代码内容
                    with open(filepath, 'r', encoding='utf-8', errors='ignore') as infile:
                        content = infile.read()
                        
                        # 统计行数（可选）
                        lines = content.count('\n') + 1
                        total_lines += lines

                        # 写入分隔符和文件元数据
                        outfile.write("=" * 70 + "\n")
                        outfile.write(f"文件: {relative_path}\n")
                        outfile.write(f"类型: {ext[1:].upper()} 代码 | 行数: {lines}\n")
                        outfile.write("=" * 70 + "\n\n")
                        
                        # 写入代码正文
                        outfile.write(content)
                        outfile.write("\n\n") # 文件之间留空行
                    
                    print(f"[合并] {relative_path}")
                    count += 1
                    
                except Exception as e:
                    print(f"[错误] 无法读取文件 {relative_path}: {e}")

    print(f"\n----------- 处理完成 -----------")
    print(f"总文件数: {count}")
    print(f"总代码行数: 约 {total_lines}")
    print(f"结果已保存至: {output_abs_path}")

if __name__ == '__main__':
    # 支持命令行参数传入路径
    target_dir = SOURCE_DIR
    if len(sys.argv) > 1:
        target_dir = sys.argv[1]

    if not os.path.exists(target_dir):
        print(f"错误: 目录 '{target_dir}' 不存在。")
    else:
        print(f"正在扫描代码目录 (白名单模式): {os.path.abspath(target_dir)} ...")
        merge_files(target_dir, OUTPUT_FILE)