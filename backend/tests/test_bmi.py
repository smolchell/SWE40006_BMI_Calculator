import pytest
from bmi import calculate_bmi, bmi_category


class TestBMICalculation:
    """Test BMI calculation function"""
    
    def test_calculate_bmi_normal_values(self):
        """Test BMI calculation with normal values"""
        # Normal case
        assert calculate_bmi(70, 1.75) == pytest.approx(22.86, 0.01)
        assert calculate_bmi(65, 1.65) == pytest.approx(23.88, 0.01)
    
    def test_calculate_bmi_edge_cases(self):
        """Test BMI calculation with edge cases"""
        # Very tall, thin person
        assert calculate_bmi(60, 1.90) == pytest.approx(16.62, 0.01)
        # Very short, heavy person
        assert calculate_bmi(90, 1.60) == pytest.approx(35.16, 0.01)
    
    def test_calculate_bmi_zero_values(self):
        """Test BMI calculation with zero values"""
        with pytest.raises(ValueError, match="weight_kg must be > 0"):
            calculate_bmi(0, 1.75)
        
        with pytest.raises(ValueError, match="height_m must be > 0"):
            calculate_bmi(70, 0)
    
    def test_calculate_bmi_negative_values(self):
        """Test BMI calculation with negative values"""
        with pytest.raises(ValueError, match="weight_kg must be > 0"):
            calculate_bmi(-70, 1.75)
        
        with pytest.raises(ValueError, match="height_m must be > 0"):
            calculate_bmi(70, -1.75)


class TestBMICategory:
    """Test BMI category classification"""
    
    def test_bmi_category_underweight(self):
        """Test underweight category boundaries"""
        assert bmi_category(16.0) == "Underweight"
        assert bmi_category(18.4) == "Underweight"
    
    def test_bmi_category_normal_weight(self):
        """Test normal weight category boundaries"""
        assert bmi_category(18.5) == "Normal weight"
        assert bmi_category(22.0) == "Normal weight"
        assert bmi_category(24.9) == "Normal weight"
    
    def test_bmi_category_overweight(self):
        """Test overweight category boundaries"""
        assert bmi_category(25.0) == "Overweight"
        assert bmi_category(27.5) == "Overweight"
        assert bmi_category(29.9) == "Overweight"
    
    def test_bmi_category_obesity(self):
        """Test obesity category boundaries"""
        assert bmi_category(30.0) == "Obesity"
        assert bmi_category(35.0) == "Obesity"
        assert bmi_category(40.0) == "Obesity"
        assert bmi_category(45.0) == "Obesity"