from flask import Flask, jsonify, render_template
import json
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('lawhome.html')

@app.route('/get_case/<int:case_id>')
def get_case(case_id):
    file_path = os.path.join('data', 'cases.json')
    with open(file_path, 'r', encoding='utf-8') as f:
        cases = json.load(f)
    if 0 <= case_id < len(cases):
        return jsonify(cases[case_id])
    else:
        return jsonify({'error': '案件不存在'}), 404

@app.route('/get_case_count')
def get_case_count():
    file_path = os.path.join('data', 'cases.json')
    with open(file_path, 'r', encoding='utf-8') as f:
        cases = json.load(f)
    return jsonify({'count': len(cases)})

if __name__ == '__main__':
    app.run(debug=True)
