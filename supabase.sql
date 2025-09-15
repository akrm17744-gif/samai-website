-- Supabase Database Schema for School Coordinators Management System
-- Created for Tabuk Education Administration

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Schools table
CREATE TABLE schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    statistical_number VARCHAR(20) UNIQUE NOT NULL,
    education_level VARCHAR(50) NOT NULL,
    gender VARCHAR(20) NOT NULL,
    education_type VARCHAR(50) NOT NULL DEFAULT 'عام',
    region VARCHAR(100) NOT NULL DEFAULT 'تبوك',
    office_department VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Departments table
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    full_name VARCHAR(500),
    administration VARCHAR(255),
    general_administration VARCHAR(255),
    department VARCHAR(255),
    section VARCHAR(255),
    unit VARCHAR(255),
    can_link BOOLEAN DEFAULT true,
    coordinator_status VARCHAR(50) DEFAULT 'available', -- available, linked, rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coordinators table
CREATE TABLE coordinators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    civil_record VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    coordinator_type VARCHAR(50) NOT NULL, -- school, department
    status VARCHAR(50) DEFAULT 'active', -- active, inactive, pending
    linked_entities JSONB, -- Store linked schools/departments
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Achievements table
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_value INTEGER NOT NULL,
    current_value INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'new', -- new, in_progress, completed
    coordinator_id UUID REFERENCES coordinators(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_schools_statistical_number ON schools(statistical_number);
CREATE INDEX idx_schools_region ON schools(region);
CREATE INDEX idx_coordinators_civil_record ON coordinators(civil_record);
CREATE INDEX idx_coordinators_phone ON coordinators(phone_number);
CREATE INDEX idx_departments_administration ON departments(administration);
CREATE INDEX idx_achievements_coordinator ON achievements(coordinator_id);

-- Insert sample schools data from Tabuk region
INSERT INTO schools (name, statistical_number, education_level, gender, education_type, office_department) VALUES
('ابتدائية أبو العجاج الأولى بضباء', '77638', 'ابتدائية', 'بنات', 'عام', 'المرحلة الابتدائية بنات'),
('ابتدائية أبو القزاز بالوجه', '77552', 'ابتدائية', 'بنات', 'عام', 'المرحلة الابتدائية بنات'),
('ابتدائية أبو راكة للطفولة المبكرة', '177687', 'ابتدائية', 'بنات', 'عام', 'المرحلة الابتدائية بنات'),
('ابتدائية إبيط بتيماء', '78021', 'ابتدائية', 'بنات', 'عام', 'المرحلة الابتدائية بنات'),
('ابتدائية أروى بنت أنيس بتبوك', '177599', 'ابتدائية', 'بنات', 'عام', 'المرحلة الابتدائية بنات'),
('ابتدائية أسماء بنت أبي بكر بضباء', '177514', 'ابتدائية', 'بنات', 'عام', 'المرحلة الابتدائية بنات'),
('ابتدائية الأبناء السادسة بتيماء', '77894', 'ابتدائية', 'بنات', 'عام', 'المرحلة الابتدائية بنات'),
('ابتدائية الإدريسي للطفولة المبكرة بتبوك', '177649', 'ابتدائية', 'بنات', 'عام', 'المرحلة الابتدائية بنات'),
('ابتدائية البديع الأولى بضباء', '77593', 'ابتدائية', 'بنات', 'عام', 'المرحلة الابتدائية بنات'),
('ابتدائية البشائر بتبوك', '177772', 'ابتدائية', 'بنات', 'عام', 'المرحلة الابتدائية بنات'),
('ابتدائية البليطح بالوجه', '43538', 'ابتدائية', 'بنات', 'عام', 'المرحلة الابتدائية بنات'),
('ابتدائية التيسير للطفولة المبكرة', '177686', 'ابتدائية', 'بنات', 'عام', 'المرحلة الابتدائية بنات'),
('ابتدائية الثريا', '177763', 'ابتدائية', 'بنات', 'عام', 'المرحلة الابتدائية بنات'),
('ابتدائية الجهراء الأولى بتيماء', '77565', 'ابتدائية', 'بنات', 'عام', 'المرحلة الابتدائية بنات'),
('ابتدائية الجو بالوحة', '43533', 'ابتدائية', 'بنات', 'عام', 'المرحلة الابتدائية بنات'),
('ابتدائية الحائل الأولى بأملج', '77651', 'ابتدائية', 'بنات', 'عام', 'المرحلة الابتدائية بنات'),
('ابتدائية الحرة الشمالية بأملج', '77580', 'ابتدائية', 'بنات', 'عام', 'المرحلة الابتدائية بنات'),
('ابتدائية الحسي الأولى بأملج', '77630', 'ابتدائية', 'بنات', 'عام', 'المرحلة الابتدائية بنات'),
('ابتدائية الخريطة الأولى', '77591', 'ابتدائية', 'بنات', 'عام', 'المرحلة الابتدائية بنات'),
('ابتدائية الخنساء بتبوك', '177597', 'ابتدائية', 'بنات', 'عام', 'المرحلة الابتدائية بنات'),
('ابتدائية الديسة الأولى بضباء', '77543', 'ابتدائية', 'بنات', 'عام', 'المرحلة الابتدائية بنات'),
('ابتدائية الذرفي الأولى بأملج', '77650', 'ابتدائية', 'بنات', 'عام', 'المرحلة الابتدائية بنات'),
('ابتدائية الرس بالوجه', '77581', 'ابتدائية', 'بنات', 'عام', 'المرحلة الابتدائية بنات'),
('ابتدائية الرياضات الأولى بأملج', '77641', 'ابتدائية', 'بنات', 'عام', 'المرحلة الابتدائية بنات'),
('ابتدائية الزيتة الأولى بحقل', '77597', 'ابتدائية', 'بنات', 'عام', 'المرحلة الابتدائية بنات'),
('ابتدائية السديد بالوجه', '77614', 'ابتدائية', 'بنات', 'عام', 'المرحلة الابتدائية بنات'),
('ابتدائية الشبحة الأولى بأملج', '77572', 'ابتدائية', 'بنات', 'عام', 'المرحلة الابتدائية بنات'),
('ابتدائية الشعبان الأولى بأملج', '77583', 'ابتدائية', 'بنات', 'عام', 'المرحلة الابتدائية بنات'),
('ابتدائية الشدخ الأولى بأملج', '77573', 'ابتدائية', 'بنات', 'عام', 'المرحلة الابتدائية بنات'),
('ابتدائية الظلفة بتبوك', '77619', 'ابتدائية', 'بنات', 'عام', 'المرحلة الابتدائية بنات'),
('ابتدائية العسافية بتيماء', '77631', 'ابتدائية', 'بنات', 'عام', 'المرحلة الابتدائية بنات');

-- Insert sample departments data from Tabuk Education Administration
INSERT INTO departments (name, full_name, administration, general_administration, department, section, unit, can_link, coordinator_status) VALUES
('مكتب مدير عام التعليم', 'الإدارة العامة للتعليم بمنطقة تبوك - مدير عام التعليم - مكتب مدير عام التعليم', 'الإدارة العامة للتعليم بمنطقة تبوك', 'مدير عام التعليم', 'مكتب مدير عام التعليم', NULL, NULL, true, 'available'),
('المراجعة الداخلية', 'الإدارة العامة للتعليم بمنطقة تبوك - مدير عام التعليم - المراجعة الداخلية', 'الإدارة العامة للتعليم بمنطقة تبوك', 'مدير عام التعليم', 'المراجعة الداخلية', NULL, NULL, false, 'linked'),
('الشؤون القانونية', 'الإدارة العامة للتعليم بمنطقة تبوك - مدير عام التعليم - الشؤون القانونية', 'الإدارة العامة للتعليم بمنطقة تبوك', 'مدير عام التعليم', 'الشؤون القانونية', NULL, NULL, true, 'available'),
('تقويم الأداء المعرفي والمهاري', 'الإدارة العامة للتعليم بمنطقة تبوك - مدير عام التعليم - تقويم الأداء المعرفي والمهاري', 'الإدارة العامة للتعليم بمنطقة تبوك', 'مدير عام التعليم', 'تقويم الأداء المعرفي والمهاري', NULL, NULL, false, 'linked'),
('الاستثمار والشراكات', 'الإدارة العامة للتعليم بمنطقة تبوك - مدير عام التعليم - الاستثمار والشراكات', 'الإدارة العامة للتعليم بمنطقة تبوك', 'مدير عام التعليم', 'الاستثمار والشراكات', NULL, NULL, false, 'linked'),
('المخاطر والالتزام', 'الإدارة العامة للتعليم بمنطقة تبوك - مدير عام التعليم - المخاطر والالتزام', 'الإدارة العامة للتعليم بمنطقة تبوك', 'مدير عام التعليم', 'المخاطر والالتزام', NULL, NULL, true, 'available'),
('الاتصال المؤسسي', 'الإدارة العامة للتعليم بمنطقة تبوك - مدير عام التعليم - الاتصال المؤسسي', 'الإدارة العامة للتعليم بمنطقة تبوك', 'مدير عام التعليم', 'الاتصال المؤسسي', NULL, NULL, false, 'linked'),
('المسؤولية المجتمعية والعمل التطوعي', 'الإدارة العامة للتعليم بمنطقة تبوك - مدير عام التعليم - المسؤولية المجتمعية والعمل التطوعي', 'الإدارة العامة للتعليم بمنطقة تبوك', 'مدير عام التعليم', 'المسؤولية المجتمعية والعمل التطوعي', NULL, NULL, false, 'linked'),
('الوعي الفكري', 'الإدارة العامة للتعليم بمنطقة تبوك - مدير عام التعليم - الوعي الفكري', 'الإدارة العامة للتعليم بمنطقة تبوك', 'مدير عام التعليم', 'الوعي الفكري', NULL, NULL, false, 'linked'),
('مكتب التعليم الخاص', 'الإدارة العامة للتعليم بمنطقة تبوك - مدير عام التعليم - مكتب التعليم الخاص', 'الإدارة العامة للتعليم بمنطقة تبوك', 'مدير عام التعليم', 'مكتب التعليم الخاص', NULL, NULL, false, 'linked'),
('مكتب المستشارين', 'الإدارة العامة للتعليم بمنطقة تبوك - مدير عام التعليم - مكتب المستشارين', 'الإدارة العامة للتعليم بمنطقة تبوك', 'مدير عام التعليم', 'مكتب المستشارين', NULL, NULL, false, 'linked'),
('مكتب المساعد للشؤون التعليمية', 'الإدارة العامة للتعليم بمنطقة تبوك - المساعد للشؤون التعليمية - مكتب المساعد للشؤون التعليمية', 'الإدارة العامة للتعليم بمنطقة تبوك', 'المساعد للشؤون التعليمية', 'مكتب المساعد للشؤون التعليمية', NULL, NULL, false, 'linked'),
('دعم التميز المدرسي', 'الإدارة العامة للتعليم بمنطقة تبوك - المساعد للشؤون التعليمية - دعم التميز المدرسي', 'الإدارة العامة للتعليم بمنطقة تبوك', 'المساعد للشؤون التعليمية', 'دعم التميز المدرسي', NULL, NULL, false, 'linked'),
('أداء التعليم', 'الإدارة العامة للتعليم بمنطقة تبوك - المساعد للشؤون التعليمية - أداء التعليم', 'الإدارة العامة للتعليم بمنطقة تبوك', 'المساعد للشؤون التعليمية', 'أداء التعليم', NULL, NULL, false, 'linked'),
('الإشراف التربوي', 'الإدارة العامة للتعليم بمنطقة تبوك - المساعد للشؤون التعليمية - أداء التعليم - الإشراف التربوي', 'الإدارة العامة للتعليم بمنطقة تبوك', 'المساعد للشؤون التعليمية', 'أداء التعليم', 'الإشراف التربوي', NULL, false, 'linked'),
('التوجيه الطلابي', 'الإدارة العامة للتعليم بمنطقة تبوك - المساعد للشؤون التعليمية - أداء التعليم - التوجيه الطلابي', 'الإدارة العامة للتعليم بمنطقة تبوك', 'المساعد للشؤون التعليمية', 'أداء التعليم', 'التوجيه الطلابي', NULL, false, 'linked'),
('النشاط الطلابي', 'الإدارة العامة للتعليم بمنطقة تبوك - المساعد للشؤون التعليمية - أداء التعليم - النشاط الطلابي', 'الإدارة العامة للتعليم بمنطقة تبوك', 'المساعد للشؤون التعليمية', 'أداء التعليم', 'النشاط الطلابي', NULL, false, 'linked'),
('التعليم المستمر', 'الإدارة العامة للتعليم بمنطقة تبوك - المساعد للشؤون التعليمية - أداء التعليم - التعليم المستمر', 'الإدارة العامة للتعليم بمنطقة تبوك', 'المساعد للشؤون التعليمية', 'أداء التعليم', 'التعليم المستمر', NULL, false, 'linked'),
('الإدارة المدرسية', 'الإدارة العامة للتعليم بمنطقة تبوك - المساعد للشؤون التعليمية - أداء التعليم - الإدارة المدرسية', 'الإدارة العامة للتعليم بمنطقة تبوك', 'المساعد للشؤون التعليمية', 'أداء التعليم', 'الإدارة المدرسية', NULL, false, 'linked'),
('الابتدائية', 'الإدارة العامة للتعليم بمنطقة تبوك - المساعد للشؤون التعليمية - أداء التعليم - الإدارة المدرسية - الابتدائية', 'الإدارة العامة للتعليم بمنطقة تبوك', 'المساعد للشؤون التعليمية', 'أداء التعليم', 'الإدارة المدرسية', 'الابتدائية', false, 'linked'),
('المتوسطة', 'الإدارة العامة للتعليم بمنطقة تبوك - المساعد للشؤون التعليمية - أداء التعليم - الإدارة المدرسية - المتوسطة', 'الإدارة العامة للتعليم بمنطقة تبوك', 'المساعد للشؤون التعليمية', 'أداء التعليم', 'الإدارة المدرسية', 'المتوسطة', false, 'linked'),
('الثانوية', 'الإدارة العامة للتعليم بمنطقة تبوك - المساعد للشؤون التعليمية - أداء التعليم - الإدارة المدرسية - الثانوية', 'الإدارة العامة للتعليم بمنطقة تبوك', 'المساعد للشؤون التعليمية', 'أداء التعليم', 'الإدارة المدرسية', 'الثانوية', false, 'linked'),
('الطفولة المبكرة', 'الإدارة العامة للتعليم بمنطقة تبوك - المساعد للشؤون التعليمية - الطفولة المبكرة', 'الإدارة العامة للتعليم بمنطقة تبوك', 'المساعد للشؤون التعليمية', 'الطفولة المبكرة', NULL, NULL, false, 'linked'),
('الحضانة', 'الإدارة العامة للتعليم بمنطقة تبوك - المساعد للشؤون التعليمية - الطفولة المبكرة - الحضانة', 'الإدارة العامة للتعليم بمنطقة تبوك', 'المساعد للشؤون التعليمية', 'الطفولة المبكرة', 'الحضانة', NULL, false, 'linked'),
('رياض الأطفال', 'الإدارة العامة للتعليم بمنطقة تبوك - المساعد للشؤون التعليمية - الطفولة المبكرة - رياض الأطفال', 'الإدارة العامة للتعليم بمنطقة تبوك', 'المساعد للشؤون التعليمية', 'الطفولة المبكرة', 'رياض الأطفال', NULL, false, 'linked'),
('تنمية القدرات', 'الإدارة العامة للتعليم بمنطقة تبوك - المساعد للشؤون التعليمية - تنمية القدرات', 'الإدارة العامة للتعليم بمنطقة تبوك', 'المساعد للشؤون التعليمية', 'تنمية القدرات', NULL, NULL, true, 'available'),
('ذوي الإعاقة', 'الإدارة العامة للتعليم بمنطقة تبوك - المساعد للشؤون التعليمية - تنمية القدرات - ذوي الإعاقة', 'الإدارة العامة للتعليم بمنطقة تبوك', 'المساعد للشؤون التعليمية', 'تنمية القدرات', 'ذوي الإعاقة', NULL, false, 'linked'),
('الموهوبين', 'الإدارة العامة للتعليم بمنطقة تبوك - المساعد للشؤون التعليمية - تنمية القدرات - الموهوبين', 'الإدارة العامة للتعليم بمنطقة تبوك', 'المساعد للشؤون التعليمية', 'تنمية القدرات', 'الموهوبين', NULL, false, 'linked'),
('الشؤون الصحية المدرسية', 'الإدارة العامة للتعليم بمنطقة تبوك - المساعد للشؤون التعليمية - تنمية القدرات - الشؤون الصحية المدرسية', 'الإدارة العامة للتعليم بمنطقة تبوك', 'المساعد للشؤون التعليمية', 'تنمية القدرات', 'الشؤون الصحية المدرسية', NULL, false, 'linked'),
('مكتب المساعد للخدمات', 'الإدارة العامة للتعليم بمنطقة تبوك - المساعد للخدمات - مكتب المساعد للخدمات', 'الإدارة العامة للتعليم بمنطقة تبوك', 'المساعد للخدمات', 'مكتب المساعد للخدمات', NULL, NULL, true, 'available');

-- Insert sample coordinators data
INSERT INTO coordinators (civil_record, name, phone_number, coordinator_type, status, linked_entities) VALUES
('1234567890', 'أحمد محمد العلي', '0501234567', 'department', 'active', '[{"id": "dept-1", "type": "department", "name": "المخاطر والالتزام"}]'),
('2345678901', 'فاطمة أحمد السالم', '0502345678', 'school', 'active', '[{"id": "school-1", "type": "school", "name": "ابتدائية أبو العجاج الأولى بضباء"}]'),
('3456789012', 'محمد عبدالله الحربي', '0503456789', 'department', 'active', '[{"id": "dept-2", "type": "department", "name": "الشؤون القانونية"}]');

-- Insert sample achievements data
INSERT INTO achievements (title, description, target_value, current_value, status, coordinator_id) VALUES
('تسجيل 100 منسق', 'الوصول إلى 100 منسق مسجل في النظام', 100, 85, 'in_progress', (SELECT id FROM coordinators LIMIT 1)),
('ربط 500 مدرسة', 'ربط 500 مدرسة بمنسقين في النظام', 500, 500, 'completed', (SELECT id FROM coordinators LIMIT 1)),
('تدريب 200 منسق', 'تدريب 200 منسق على استخدام النظام', 200, 120, 'in_progress', (SELECT id FROM coordinators LIMIT 1)),
('تحسين الأداء 25%', 'تحسين أداء المدارس بنسبة 25%', 25, 10, 'new', (SELECT id FROM coordinators LIMIT 1)),
('تقييم ممتاز', 'الحصول على تقييم ممتاز من 90% من المستخدمين', 90, 95, 'completed', (SELECT id FROM coordinators LIMIT 1)),
('استجابة سريعة', 'تحقيق زمن استجابة أقل من 3 ثوانٍ', 3, 2, 'completed', (SELECT id FROM coordinators LIMIT 1));

-- Create triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON schools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coordinators_updated_at BEFORE UPDATE ON coordinators FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_achievements_updated_at BEFORE UPDATE ON achievements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) for better security
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE coordinators ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for production)
CREATE POLICY "Allow public read access on schools" ON schools FOR SELECT USING (true);
CREATE POLICY "Allow public read access on departments" ON departments FOR SELECT USING (true);
CREATE POLICY "Allow public read access on coordinators" ON coordinators FOR SELECT USING (true);
CREATE POLICY "Allow public read access on achievements" ON achievements FOR SELECT USING (true);

CREATE POLICY "Allow public insert on coordinators" ON coordinators FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on achievements" ON achievements FOR INSERT WITH CHECK (true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

