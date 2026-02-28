# def fizz_buzz(n):
#     for i in range(1, n + 1):
#         if i % 3 == 0 and i % 5 == 0:
#             print("FizzBuzz")
#         elif i % 3 == 0:
#             print("Fizz")
#         elif i % 5 == 0:
#             print("Buzz")
#         else:
#             print(i)


# fizz_buzz(15)

# def is_palindrome(s):
#     cleaned_string = s.replace(",", "").replace(" ", "")
#     reversed_string = cleaned_string[::-1]

#     return cleaned_string.lower() == reversed_string.lower()


# print(is_palindrome("A man, a plan, a canal, Panama"))

# def find_primes(n):
#     if n < 2:
#         return []
#     if n == 2:
#         return [2]
#     primes = []
#     for i in range(2, n):
#         if n % i != 1:
#             primes.append(i)

#     return primes


# print(find_primes(10))

# def second_largest(arr):
#     if arr is None:
#         return None
#     if len(arr) == 1:
#         return None

#     newSet = set(arr)
#     nodub = sorted(list(newSet), reverse=True)

#     if nodub[1] == nodub[0]:
#         return None

#     return nodub[1]


# print(second_largest([1, 2, 3, 4, 5]))   # Output: 4
# print(second_largest([10, 10, 9, 8]))    # Output: 9
# print(second_largest([4]))                # Output: None
# print(second_largest([5, 5, 5, 5]))       # Output: None
# print(second_largest([1, 2, 3, 3, 2]))    # Output: 2

# def returnidices(nums, target):
#     numbers = {}
#     for i in range(len(nums) - 1):
#         needed = target - nums[i]
#         if needed in numbers:
#             return [i, numbers[needed]]
#         numbers[nums[i]] = i

# str
# print(returnidices([2, 7, 11, 15], 9))

# def removeDuplicates(nums):
#     j = 1
#     for i in range(1, len(nums)):
#         if nums[i] != nums[i - 1]:
#             nums[j] = nums[i]
#             j += 1
#     return j


# print(removeDuplicates([1,1,1,2,2,2,]))
